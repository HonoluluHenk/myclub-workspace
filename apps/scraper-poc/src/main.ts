import * as moment from 'moment';

const fs = require('fs');
const path = require('path');
const inFile = path.join(__dirname, '../../../sampledata/Club-Calendar/click-TT – Begegnungen.html');
const outfile = path.join(__dirname, '../../../sampledata/Club-Calendar/click-TT – Begegnungen.json');

const data = fs.readFileSync(inFile);

const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');

const $ = cheerio.load(data);
jsonframe($);

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

const frame = {
  data: {
    _s: "tr",
    _d: [{
      weekday: ":nth-child(1)",
      date: ":nth-child(2)",
      time: ":nth-child(3)", // FIXME: n/t
      location: ":nth-child(4)",
      round: ":nth-child(5)",
      division: ":nth-child(6)",
      homeTeam: ":nth-child(7)",
      homeWin: ":nth-child(8)",
      guestTeam: ":nth-child(9)",
      guestWin: ":nth-child(10)",
      score: ":nth-child(11)",
      flags: ":nth-child(12)",
      resultsChecked: ":nth-child(13)",
    }]
  }
};

const rawCalendar = $('table.result-set tbody').scrape(frame);
let lastDate: moment.Moment = null;

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

function parseDate(dateText) {
  let date: moment.Moment;
  const cleanText = clean(dateText);
  if (cleanText === '') {
    date = lastDate;
  } else {
    date = moment.utc(clean(cleanText), 'DD.MM.YYYY');
  }
  lastDate = date;

  return date;
}

function parseFlags(notes) {
  const cleaned = clean(notes);

  return {
    rawFlags: cleaned,
    teamCancelled: cleaned.indexOf('Z') >= 0
  };
}

export interface ScrapedScore {
  home: number,
  guest: number
}
export interface ScrapedClubSchedule {
  dateTimeAsUTC: Date,
  homeTeam: string,
  guestTeam: string,
  divistion: string,
  location: string,
  score: ScrapedScore | undefined,
  matchMoved: boolean | undefined,
  matchHomeSwitched: boolean | undefined,
  round: number,
  teamCancelled: boolean | undefined,
  rawFlags: string,
}

function cleanupEntry(e: any): ScrapedClubSchedule {
  const date = parseDate(e.date);
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

const clubCalendar = (rawCalendar.data as any)
  .slice(1) // skip header
  .filter(e => !!clean(e.time)) // some invisible empty rows???
  .map(cleanupEntry)
  .filter(e => !!e)
  .sort(e => e.dateTime);

console.log(clubCalendar); // Output the data in the terminal
// console.log(clubCalendar.length); // Output the data in the terminal

fs.writeFileSync(outfile, JSON.stringify(clubCalendar));


