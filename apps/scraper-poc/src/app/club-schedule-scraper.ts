import * as moment from "moment";
import { ScrapedClubSchedule } from "../../../../libs/scraper/src/lib/ScrapedClubSchedule";

const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');
import fetch from 'cross-fetch';

const { URLSearchParams } = require('url');

const SCRAPER_RESULT_SET_DEFINITION = {
  data: {
    _s: "tr",
    _d: [{
      weekday: ":nth-child(1)",
      date: ":nth-child(2)",
      time: ":nth-child(3)", // v: matchdate moved, t: home/guest switched
      location: ":nth-child(4)",
      round: ":nth-child(5)",
      division: ":nth-child(6)",
      homeTeam: ":nth-child(7)",
      homeWin: ":nth-child(8)",
      guestTeam: ":nth-child(9)",
      guestWin: ":nth-child(10)",
      score: ":nth-child(11)",
      flags: ":nth-child(12)", // Z: team withdrawn
      resultsChecked: ":nth-child(13)",
    }]
  }
};



export class ClubScheduleScraper {
  async scrape(clubId: number, timeRange: string): Promise<ScrapedClubSchedule[]> {
    // const formData = new FormData();
    const formData = new URLSearchParams();
    formData.append("searchType", "0");
    formData.append("searchTimeRange", timeRange);
    formData.append("searchTimeRangeFrom", "");
    formData.append("searchTimeRangeTo", "");
    formData.append("selectedTeaId", "WONoSelectionString");
    formData.append("club", "" + clubId);
    formData.append("searchMeetings", "Suchen");

    const response = await fetch("https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubMeetings",
      {
      method: "POST",
        // mode: "no-cors"
        cache: "no-cache", // FIXME: implement caching?
        redirect: "follow",
        referrer: "no-referrer",
        body: formData,
    });

    return this.scrapeFromHTML(await response.text());
  }

  scrapeFromHTML(htmlData: string): ScrapedClubSchedule[] {
    const $ = cheerio.load(htmlData);
    jsonframe($);

    // false positive/invalid typings
    // noinspection TypeScriptValidateJSTypes
    const rawSchedule = $('table.result-set tbody')
      .scrape(SCRAPER_RESULT_SET_DEFINITION);

    const rowState = {lastDate: null};

    const clubSchedule = (rawSchedule.data as [{[key: string]: any}])
      .slice(1) // skip header
      .filter(e => !!clean(e.time)) // some invisible empty rows???
      .map(e => cleanupEntry(e, rowState))
      .filter(e => !!e)
      .sort((a, b) => a.dateTimeAsUTC.getTime() - b.dateTimeAsUTC.getTime());

    return clubSchedule;

  }
}

function cleanupEntry(e: any, rowState: {lastDate: moment.Moment}): ScrapedClubSchedule {
  const date = parseDate(e.date, rowState.lastDate);
  rowState.lastDate = date;

  const {time, matchMoved, matchHomeSwitched} = parseTime(e.time);
  const dateTimeAsUTC = concatDateTime(date, time).toDate();

  const {rawFlags, teamCancelled} = parseFlags(e.flags);
  const score = parseScore(e.score);
  const round = parseRound(e.round);
  const location = parseLocation(e.location);

  return {
    dateTimeAsUTC,
    homeTeam: e.homeTeam,
    guestTeam: e.guestTeam,
    divistion: e.division,
    location,
    score,
    matchMoved,
    matchHomeSwitched,
    round,
    teamCancelled,
    rawFlags,
  }
}


function parseDate(dateText, dateFiller: moment.Moment): moment.Moment {
  let date: moment.Moment;
  const cleanText = clean(dateText);
  if (cleanText === '') {
    date = dateFiller;
  } else {
    date = moment.utc(clean(cleanText), 'DD.MM.YYYY');
  }

  return date;
}


function trimToEmpty(text: string | null | undefined): string {
  if (text) {
    const result = text.trim();
    return result;
  }
  return '';
}

function clean(text: string | null | undefined): string {
  const cleaned = trimToEmpty(text);
  return cleaned;
}

function parseScore(score) {
  const cleaned = clean(score);

  if (!cleaned) {
    return undefined;
  }

  const parts = score.split(':');
  return {
    home: Number.parseInt(parts[0], 10),
    guest: Number.parseInt(parts[1], 10)
  }
}

function parseRound(round): number {
  return Number.parseInt(round, 10);
}

function parseLocation(location): string {
  return clean(location);
}

function concatDateTime(date: moment.Moment, time: moment.Moment): moment.Moment {
  return moment(date).add({
    hour: time.get('hour'),
    minute: time.get('minute')
  });
}

function parseTime(timeText) {
  const time = moment.utc(clean(timeText), 'HH:mm');

  const matchMoved = timeText.indexOf('v') >= 0;
  const matchHomeSwitched = timeText.indexOf('t') >= 0;
  return {
    time,
    matchMoved,
    matchHomeSwitched
  };
}

function parseFlags(notes) {
  const cleaned = clean(notes);

  return {
    rawFlags: cleaned,
    teamCancelled: cleaned.indexOf('Z') >= 0
  };
}
