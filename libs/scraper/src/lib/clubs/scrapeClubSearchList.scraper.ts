import {ClubSearchOptions} from './scrapeClubSearch.scraper';
import {download} from '../shared/download';
import * as cheerio from 'cheerio';
import {clean} from '../scrape-helpers';

export interface ClubListEntry {
  clubName: string,
  clubNumber: number,
  clubId: number,
  clubInfoURL: string,
}

export async function scrapeClubSearchList(urlOrSearchOptions: string | ClubSearchOptions): Promise<ClubListEntry[]> {
  const url = buildURL(urlOrSearchOptions);

  const responseText = await download(url);

  return scrapeFromHTML(responseText);

}

function buildURL(
  urlOrSearchOptions: string | ClubSearchOptions,
): string {
  // example URL:
  // https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?searchPattern=CH.05&federation=STT&regionName=Mittell%C3%A4ndischer+Tischtennisverband&federations=STT

  if (typeof urlOrSearchOptions === 'string') {
    return urlOrSearchOptions;
  }

  return urlOrSearchOptions.searchURL;
}

function scrapeFromHTML(html: string): ClubListEntry[] {
  const $ = cheerio.load(html);

  const result = $('table[class="result-set"] > tbody tr')
    .slice(1) // header row
    .map((idx, elem) => scrapeEntry(elem))
    .toArray() as any as ClubListEntry[]
  ;

  if (result.length === 0) {
    // scraping error?!?
    throw new Error('scraping error: nothing found???');
  }

  return result;
}

function scrapeEntry(trElem: any): ClubListEntry {
  const $tr = cheerio.load(trElem);
  const $td = $tr('td').first();
  const $a = $td.children('a');

  const clubInfoURL = $a.attr('href') || '';
  const clubId = parseClubId(clubInfoURL);
  const clubNumber = parseClubNumber($td.contents().filter((_, elem) => elem.type === 'text').slice(1).text());
  const clubName = clean($a.text());

  return {
    clubId,
    clubNumber,
    clubName,
    clubInfoURL,
  };
}

function parseClubNumber(text: string): number {
  // example:
  // (50069)

  const matches = /\((\d+)\)/.exec(text);
  if (!matches) {
    return -1;
  }

  return parseInt(matches[1], 10);
}

function parseClubId(url: string): number {
  // example:
  // /cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubInfoDisplay?club=33089

  const matches = /club=(\d+)/.exec(url);
  if (!matches) {
    return -1;
  }

  const result = parseInt(matches[1], 10);

  return result;
}
