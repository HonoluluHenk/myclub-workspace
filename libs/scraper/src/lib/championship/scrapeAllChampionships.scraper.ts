import {Championship} from './championship.type';
import {download} from '../shared/download';
import {SupportedLang} from '../shared/i18n';
import * as cheerio from 'cheerio';
import {flatten} from 'lodash';
import {clean} from '../scrape-helpers';

interface ScrapedLeague {
  leagueName: string;
  championships: ScrapedChampionship[]
}

interface ScrapedChampionship {
  id: string;
  name: string;
}

export async function scrapeAllChampionships(
  lang: SupportedLang,
): Promise<Championship[]> {
  const url = buildChampionshipsURL(lang);

  const responseText = await download(url);
  // console.log("response text", responseText);

  return scrapeFromHTML(responseText);
}

function scrapeFromHTML(htmlData: string): Championship[] {
  // console.log('html', htmlRows.html(), htmlData);
  const data: ScrapedLeague[] = scrapeLeagues(htmlData);

  const championships: Championship[] = flatten(
    data
      .map(e => parseScrapedRow(e))
  );

  if (championships.length === 0) {
    // scraping error?!?
    throw new Error('scraping error: nothing found???');
  }

  return championships;

}

function scrapeLeagues(html: string): ScrapedLeague[] {
  const $ = cheerio.load(html);

  const leagues = $('div[id="navigation"] > ul > li');

  const result: ScrapedLeague[] = leagues
    .map((idx, elem) => scrapeLeague(elem))
    .toArray() as any as ScrapedLeague[];

  return result;
}

function scrapeLeague(liElem: CheerioElement): ScrapedLeague {
  const $ = cheerio.load(liElem);

  const leagueName = clean($('li > strong').text());
  const championships = scrapeChampionships($('li > ul > li'))

  return {
    leagueName,
    championships,
  };
}

function scrapeChampionships(liElementsBag: Cheerio): ScrapedChampionship[] {
  const result: ScrapedChampionship[] = [];

  for (let i = 0; i < liElementsBag.length; i++) {
    const liElem = cheerio.load(liElementsBag[i]);

    const url = clean(liElem('li > a').attr('href'));
    const name = clean(liElem('li > a').text());
    // console.log('found', url, name);

    const id = parseChampionshipIdFromUrl(url);
    if (!id) {
      continue;
    }

    result.push({
      id,
      name,
    })
  }

  return result;
}

function parseChampionshipIdFromUrl(url: string): string | null {
  if (!url.includes("/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/leaguePage?championship=")) {
    return null;
  }

  const found = /championship=(.*?)&/.exec(url);
  if (!found) {
    return null;
  }

  const id = decodeURIComponent(found[1])
    .replace(/\+/g, ' ');

  return id;
}

function parseScrapedRow(league: ScrapedLeague): Championship[] {
  const result = league.championships.map(champ => (<Championship>{
    leagueName: league.leagueName,
    id: champ.id,
    name: champ.name,
  }));

  return result;
}


function buildChampionshipsURL(lang: SupportedLang) {
  const url = `https://www.click-tt.ch/index.htm.${lang}`;

  return url;
}



