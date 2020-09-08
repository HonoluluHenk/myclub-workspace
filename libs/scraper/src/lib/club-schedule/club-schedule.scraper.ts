import {DateTime} from 'luxon';
import {ClubSchedule} from '.';
import * as cheerio from 'cheerio';
import {download} from '../shared/download';
import {clean, parseDate, parseDateFormat} from '../scrape-helpers';

export async function scrapeClubSchedule(
  seasonStartYear: number,
  clubId: number,
  teamId?: number,
): Promise<ClubSchedule[]> {
  const url = buildSpielplanGesamtURL(seasonStartYear, clubId, teamId);
  // console.debug('scrape url', seasonStartYear, clubId, teamId, url);

  const responseText = await download(url);
  // console.log("response text", responseText);

  return scrapeFromHTML(responseText);
}

interface ScrapedRow {
  weekday: string;
  date: string;
  /**
   * currently known: "v": match date moved, "t": home/guest switched
   */
  timeAndFlags: string;
  location: string;
  round: string;
  division: string;
  homeTeam: string;
  homeWin: string;
  guestTeam: string;
  guestWin: string;
  score: string;
  /**
   * currently known: "Z": team withdrawn
   */
  resultFlags: string;
  resultsChecked: string;
}

function buildSpielplanGesamtURL(seasonStartYear: number, clubId: number, teamId?: number): string {
  // const query = `?club=33282&searchType=1&searchTimeRangeFrom=01.07.2020&searchTimeRangeTo=31.06.2021`
  const startDate = `01.07.${encodeURIComponent(seasonStartYear)}`;
  const endDate = `31.06.${encodeURIComponent(seasonStartYear + 1)}`;
  const teamParam = teamId ? '&selectedTeamId=' + encodeURIComponent(teamId) : '';
  const queryParams = `club=${encodeURIComponent(clubId)}&searchType=1&searchTimeRangeFrom=${startDate}&searchTimeRangeTo=${endDate}${teamParam}`;
  return `https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubMeetings?${queryParams}`;
}

function scrapeRow(trElem: CheerioElement): ScrapedRow {
  const row = cheerio.load(trElem, {
    ignoreWhitespace: false,
    normalizeWhitespace: true,
  });

  function nthChild(childIdx: number) {
    return clean(row(`tr td:nth-child(${childIdx})`).text());
  }

  return {
    weekday: nthChild(1),
    date: nthChild(2),
    timeAndFlags: nthChild(3),
    location: nthChild(4),
    round: nthChild(5),
    division: nthChild(6),
    homeTeam: nthChild(7),
    homeWin: nthChild(8),
    guestTeam: nthChild(9),
    guestWin: nthChild(10),
    score: nthChild(11),
    resultFlags: nthChild(12),
    resultsChecked: nthChild(13),
  };
}

function scrapeRows(html: string): ScrapedRow[] {
  const $ = cheerio.load(html);

  const rows: ScrapedRow[] = $('table.result-set tbody tr')
    .map((idx, elem) => scrapeRow(elem))
    .toArray() as any;

  // console.log('rows', rows);

  return rows;
}

function scrapeFromHTML(htmlData: string): ClubSchedule[] {
  // console.log('html', htmlRows.html(), htmlData);
  const data = scrapeRows(htmlData);


  const rowState = {lastDate: null};

  const clubSchedule = data
    .slice(1) // skip header
    .filter(e => !!clean(e.timeAndFlags)) // some invisible empty rows???
    .map(e => parseScrapedRow(e, rowState))
    .filter(e => !!e)
    .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());

  if (clubSchedule.length === 0) {
    // scraping error?!?
    throw new Error('scraping error: nothing found???');
  }

  return clubSchedule;

}

function parseScrapedRow(e: ScrapedRow, rowState: { lastDate: DateTime | null }): ClubSchedule {
  const date = parseDate(e.date, rowState.lastDate);
  if (!date) {
    throw Error('Illegal state: date empty but previous line did not contain a date?' + JSON.stringify(e));
  }
  rowState.lastDate = date;

  const divisionName = parseDivisionName(e.division);
  const timeAndMatch = parseTimeAndMatchFlags(e.timeAndFlags);
  const localDateTimeAsUTC = concatDateTime(date, timeAndMatch.time).toJSDate();

  // throw new Error(`${date.toISO()}/${timeAndMatch.time}/${startDateTime.toISOString()}`);

  const {resultFlags, teamCancelled, remainingFlags: unhandledResultFlags} = parseResultFlags(e.resultFlags);
  const score = parseScore(e.score);
  const round = parseRound(e.round);
  const location = parseLocation(e.location);
  const unhandledFlags = [
    (timeAndMatch.unhandledMatchFlags ? 'Match: ' + timeAndMatch.unhandledMatchFlags : ''),
    (unhandledResultFlags ? 'Result: ' + unhandledResultFlags : ''),
  ].filter(f => !!f)
    .join(',');

  if (unhandledFlags) {
    console.warn('Unhandled flags: ' + unhandledFlags);
  }

  return {
    divisionName,
    startDateTime: localDateTimeAsUTC,
    homeTeam: e.homeTeam,
    guestTeam: e.guestTeam,
    location,
    score,
    matchRescheduled: timeAndMatch.matchRescheduled,
    matchHomeSwitched: timeAndMatch.matchHomeSwitched,
    matchFlags: timeAndMatch.matchFlags,
    round,
    teamCancelled,
    resultFlags,
    unhandledFlags,
  };
}

function parseDivisionName(text: string): string {
  return clean(text);
}

function parseScore(score: string) {
  const cleaned = clean(score);

  if (!cleaned) {
    return undefined;
  }

  const parts = score.split(':');
  return {
    home: Number.parseInt(parts[0], 10),
    guest: Number.parseInt(parts[1], 10),
  };
}

function parseRound(round: string): number {
  return Number.parseInt(round, 10);
}

function parseLocation(location: string): string {
  return clean(location).replace(/[()]/g, '');
}

function concatDateTime(date: DateTime, time: DateTime): DateTime {
  return date.plus({
    hour: time.hour,
    minute: time.minute,
  });
}

function parseTimeAndMatchFlags(timeAndFlagsText: string) {
  const [timeText, flagsText] = timeAndFlagsText.split(/\s+/);
  const cleanTimeText = clean(timeText);
  const matchFlags = clean(flagsText)
    .replace('/', ''); // remove optional separator

  const time = parseDateFormat(cleanTimeText, 'HH:mm');

  // throw new Error(time?.toISO());

  if (!time.isValid) {
    throw new Error(`Invalid time: ${cleanTimeText}/${timeAndFlagsText}`);
  }

  const {found: matchRescheduled, remainingFlags: remaining1} = parseFlag('v', matchFlags);
  const {found: matchHomeSwitched, remainingFlags: unhandledMatchFlags} = parseFlag('t', remaining1);

  return {
    time,
    matchRescheduled,
    matchHomeSwitched,
    matchFlags,
    unhandledMatchFlags,
  };
}

function parseResultFlags(notes: string) {
  const resultFlags = clean(notes)
    .replace('/', ''); // remove optional separator

  const {found: teamCancelled, remainingFlags} = parseFlag('Z', resultFlags);

  return {
    teamCancelled,
    resultFlags,
    remainingFlags,
  };
}

function parseFlag(flag: string, allFlags: string): { found: boolean, remainingFlags: string } {
  const found = allFlags.indexOf(flag) >= 0;

  const remainingFlags = found
    ? allFlags.replace(flag, '')
    : allFlags;

  return {
    found,
    remainingFlags,
  };

}
