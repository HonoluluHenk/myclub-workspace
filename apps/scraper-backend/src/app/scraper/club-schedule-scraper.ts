import { ScrapedClubSchedule } from "@myclub/scraper";
import { Injectable } from "@nestjs/common";
import {DateTime} from 'luxon';

const fetch = require("node-fetch");

const cheerio = require("cheerio");
const jsonframe = require("jsonframe-cheerio");

const SCRAPER_RESULT_SET_DEFINITION = {
  data: {
    _s: "tr",
    _d: [{
      weekday: ":nth-child(1)",
      date: ":nth-child(2)",
      timeAndFlags: ":nth-child(3)", // v: matchdate moved, t: home/guest switched
      location: ":nth-child(4)",
      round: ":nth-child(5)",
      homeTeam: ":nth-child(6)",
      homeWin: ":nth-child(7)",
      guestTeam: ":nth-child(8)",
      guestWin: ":nth-child(9)",
      score: ":nth-child(10)",
      flags: ":nth-child(11)", // Z: team withdrawn
      resultsChecked: ":nth-child(12)"
    }]
  }
};

function buildSpielplanGesamtURL(championship: string, groupId: number): string {
  return `https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/groupPage?displayTyp=gesamt&displayDetail=meetings&championship=${encodeURIComponent(championship)}&group=${encodeURIComponent(groupId)}`;
}

@Injectable()
export class ClubScheduleScraper {
  async scrape(championship: string, groupId: number): Promise<ScrapedClubSchedule[]> {
    const url = buildSpielplanGesamtURL(championship, groupId);
    // console.debug('scrape url',championship, groupId, url);

    const response = await fetch(url,
      {
        method: "GET",
        // mode: "no-cors"
        cache: "no-cache", // FIXME: implement caching?
        redirect: "follow",
        referrer: "no-referrer",
      });

    const responseText = await response.text();
    // console.log("response text", responseText);

    return this.scrapeFromHTML(responseText);
  }

  scrapeFromHTML(htmlData: string): ScrapedClubSchedule[] {
    const $ = cheerio.load(htmlData);
    jsonframe($);

    // false positive/invalid typings
    // noinspection TypeScriptValidateJSTypes
    const rawSchedule = $("table.result-set tbody")
      .scrape(SCRAPER_RESULT_SET_DEFINITION);

    const rowState = { lastDate: null };

    const clubSchedule = (rawSchedule.data as [{ [key: string]: any }])
      .slice(1) // skip header
      .filter(e => !!clean(e.timeAndFlags)) // some invisible empty rows???
      .map(e => cleanupEntry(e, rowState))
      .filter(e => !!e)
      .sort((a, b) => a.localDateTimeAsUTC.getTime() - b.localDateTimeAsUTC.getTime());

    if (clubSchedule.length === 0) {
      // scraping error?!?
      throw new Error("scraping error: nothing found???");
    }

    return clubSchedule;

  }
}

function cleanupEntry(e: any, rowState: { lastDate: DateTime | null }): ScrapedClubSchedule {
  const date = parseDate(e.date, rowState.lastDate);
  if (!date) {
    throw Error("Illegal state: date empty but previous line did not contain a date?" + JSON.stringify(e));
  }
  rowState.lastDate = date;

  const { time, matchMoved, matchHomeSwitched } = parseTimeAndFlags(e.timeAndFlags);
  const localDateTimeAsUTC = concatDateTime(date, time).toJSDate();

  const { rawFlags, teamCancelled } = parseFlags(e.flags);
  const score = parseScore(e.score);
  const round = parseRound(e.round);
  const location = parseLocation(e.location);

  return {
    localDateTimeAsUTC,
    homeTeam: e.homeTeam,
    guestTeam: e.guestTeam,
    location,
    score,
    matchMoved,
    matchHomeSwitched,
    round,
    teamCancelled,
    rawFlags
  };
}

function parseDate(dateText: string, fallback: DateTime | null): DateTime | null {
  let date: DateTime | null;
  const cleanText = clean(dateText);
  if (cleanText) {
    date = DateTime.fromFormat(cleanText, "dd.MM.yyyy", {locale: "de", zone: "Europe/Zurich", setZone: true});
  } else {
    date = fallback;
  }

  if(date?.isValid) {
    return date;
  }

  throw new Error(`Invalid date: ${date}(${dateText}/${fallback})`);
}

function trimToEmpty(text: string | null | undefined): string {
  if (text) {
    const result = text.trim();
    return result;
  }
  return "";
}

function clean(text: string | null | undefined): string {
  const cleaned = trimToEmpty(text);
  return cleaned;
}

function parseScore(score: string) {
  const cleaned = clean(score);

  if (!cleaned) {
    return undefined;
  }

  const parts = score.split(":");
  return {
    home: Number.parseInt(parts[0], 10),
    guest: Number.parseInt(parts[1], 10)
  };
}

function parseRound(round: string): number {
  return Number.parseInt(round, 10);
}

function parseLocation(location: string): string {
  return clean(location).replace(/[()]/g, "");
}

function concatDateTime(date: DateTime, time: DateTime): DateTime {
  return date.plus({
    hour: time.hour,
    minute: time.minute,
  });
}

function parseTimeAndFlags(timeAndFlagsText: string) {
  const [timeText, flagsText] = timeAndFlagsText.split(/\s+/);
  const cleanTimeText = clean(timeText);
  const cleanFlagsText = clean(flagsText);

  const time = DateTime.fromFormat(cleanTimeText, "HH:mm", {locale: "de", zone: "utc"});

  if (!time.isValid) {
    throw new Error(`Invalid time: ${cleanTimeText}/${timeAndFlagsText}`);
  }

  const matchMoved = cleanFlagsText.indexOf("v") >= 0;
  const matchHomeSwitched = cleanFlagsText.indexOf("t") >= 0;
  return {
    time,
    matchMoved,
    matchHomeSwitched
  };
}

function parseFlags(notes: string) {
  const cleaned = clean(notes);

  return {
    rawFlags: cleaned,
    teamCancelled: cleaned.indexOf("Z") >= 0
  };
}
