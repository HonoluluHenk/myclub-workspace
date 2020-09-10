import {PreferredLanguage} from '../shared/i18n';
import {download} from '../shared/download';
import * as cheerio from 'cheerio';
import {clean} from '../scrape-helpers';

export type LeagueType =
  | 'UNKNOWN'
  | 'HE'
  | 'DA'
  | 'O40'
  | 'O50'
  | 'SEN' // Lt. Reglement wohl eine Zusammenfassung von allen OXX Klassen, siehe AVVF
  | 'U18'
  | 'U15'
  | 'U13'
  | 'JUG' // Lt. Reglement wohl eine Zusammenfassung vonallen UXX Klassen, siehe AVVF
  | 'FSL' // Freundschaftsliga (siehe TTVI)
  | 'SJC' // Suisse Junior Challenge

const LeagueTypeNames: { [key: string]: LeagueType } = {
  'Herren': 'HE',
  'Hommes': 'HE',
  'Uomini': 'HE',
  'Damen': 'DA',
  'Senioren O40': 'O40',
  'Senioren O50': 'O50',
  'Veteranen O50': 'O50',
  'Seniors': 'SEN',
  'Nachwuchs U18': 'U18',
  'Nachwuchs U15': 'U15',
  'Nachwuchs U13': 'U13',
  'Jeunesse': 'JUG',
  'Herren FSL': 'FSL',
  'Suisse Junior Challenge': 'SJC',
};

export interface ChampionshipGroup {
  groupId: number;
  /**
   * e.g.: "HE 3. Liga Gr. 1"
   */
  groupName: string;
  url: string;
  /**
   * E.g.: "HE" or "DA"
   */
  leagueType: LeagueType;
}

function buildChampionshipURL(championshipId: string, lang: PreferredLanguage): string {
  const c = encodeURIComponent(championshipId);
  const l = encodeURIComponent(lang);
  return `https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/leaguePage?championship=${c}&preferredLanguage=${l}`;
}

export async function scrapeChampionship(
  championshipId: string,
  lang: PreferredLanguage,
): Promise<ChampionshipGroup[]> {
  const url = buildChampionshipURL(championshipId, lang);

  const responseText = await download(url);

  return scrapeFromHTML(responseText);
}

function scrapeFromHTML(htmlData: string): ChampionshipGroup[] {
  // console.log('html', htmlRows.html(), htmlData);
  const championshipLeagues: ChampionshipGroup[] = scrapeChampionshipLeagues(htmlData);

  if (championshipLeagues.length === 0) {
    // scraping error?!?
    throw new Error('scraping error: nothing found???');
  }

  return championshipLeagues;

}

function scrapeChampionshipLeagues(html: string): ChampionshipGroup[] {
  const $ = cheerio.load(html);

  const result = $('div[id="content"] table[class="matrix"] > tbody > tr > td')
    .map((idx, elem) => scrapeColumn(elem))
    .toArray() as any as ChampionshipGroup[];

  return result;
}

function scrapeColumn(tdElem: CheerioElement): ChampionshipGroup[] {
  const result: ChampionshipGroup[] = [];

  // a column consists of a sequence of h2 (the leage type text) and ul>li (the groups within then league type).
  let currentLeagueType: LeagueType = 'UNKNOWN';
  const entries = cheerio.load(tdElem)('h2,ul').toArray();

  for (let i = 0; i < entries.length; i++) {
    const $ = cheerio.load(entries[i]);

    // noinspection JSJQueryEfficiency
    const h2 = $('h2');
    if (h2.length) {
      const leagueTypeText = $('h2').text();
      currentLeagueType = parseLeagueType(leagueTypeText);
      continue;
    }

    const leaguesAnchor = $('ul li span a').toArray();
    // false positive
    // tslint:disable-next-line:rxjs-no-unsafe-scope
    const leagues = leaguesAnchor.map(l => parseEntry(l, currentLeagueType));
    result.push(...leagues);
  }

  return result;
}

function parseLeagueType(text: string): LeagueType {
  const cleanText = clean(text);

  const leagueType = LeagueTypeNames[cleanText] ?? 'UNKNOWN';

  return leagueType;
}

function parseEntry(entry: CheerioElement, leagueType: LeagueType): ChampionshipGroup {
  const anchor = cheerio.load(entry)('a');

  const url = anchor.attr('href') ?? '';
  const groupId = parseGroupId(url);

  const groupName = clean(anchor.text());

  return {
    groupId,
    groupName,
    url,
    leagueType,
  };

}

function parseGroupId(url: string): number {
  // /cgi-bin/WebObjects/nuLigaTTCH.woa/wa/groupPage?championship=MTTV+20%2F21&group=206956

  const matches = /.*group=(\d+)/.exec(url);
  if (!matches) {
    throw Error(`unsupported url: ${url}`);
  }

  return parseInt(matches[1], 10);
}
