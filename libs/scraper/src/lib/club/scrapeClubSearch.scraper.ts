import {download} from '../shared/download';
import * as cheerio from 'cheerio';
import {Federation} from './federation.type';

export const FEDERATION_STT: Federation = {
  name: 'STT',
  rootURL: 'https://www.click-tt.ch',
};

export interface ClubSearchOptions {
  federation: Federation;
  regionName: string;
  searchURL: string;
  searchPattern: string,
}

export async function scrapeClubSearchOptions(federation: Federation = FEDERATION_STT): Promise<ClubSearchOptions[]> {
  const url = buildClubSearchUrl(federation);

  const responseText = await download(url);

  return scrapeFromHTML(federation, responseText);
}

function buildClubSearchUrl(federation: Federation): string {
  const f = encodeURIComponent(federation.name);
  return `${federation.rootURL}/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?federation=${f}`;
}

function scrapeFromHTML(federation: Federation, html: string): ClubSearchOptions[] {
  const $ = cheerio.load(html);

  const result = $('form[class="search-query"] > ul')
    .map((idx, elem) => scrapeEntry(federation, elem))
    .toArray() as any as ClubSearchOptions[];

  if (result.length === 0) {
    // scraping error?!?
    throw new Error('scraping error: nothing found???');
  }

  return result;
}

function scrapeEntry(federation: Federation, ulElem: CheerioElement): ClubSearchOptions[] {
  const result: ClubSearchOptions[] = [];

  // a column consists of a sequence of h2 (the leage type text) and ul>li (the groups within then league type).
  const entries = cheerio.load(ulElem)('li').toArray();

  for (let i = 0; i < entries.length; i++) {
    const $ = cheerio.load(entries[i]);

    const $a = $('a');
    const searchURL = federation.rootURL + $a.attr('href') || '';
    const regionName = $a.text();
    const searchPattern = parseSearchPatternFromURL(searchURL);

    result.push({
      federation,
      regionName,
      searchURL,
      searchPattern,
    });
  }

  return result;
}

function parseSearchPatternFromURL(searchURL: string): string {
  // example:
  // /cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?searchPattern=CH.01&federation=STT&regionName=Association+Genevoise+de+Tennis+de+Table&federations=STT
  const matches = /searchPattern=(.*?)(&|$)/.exec(searchURL);
  if (!matches) {
    return '';
  }

  const result = matches[1];

  return result;
}

