import {download} from '../shared/download';
import * as cheerio from 'cheerio';
import {Federation} from './federation.type';
import {clean, myDecodeURIComponent} from '../scrape-helpers';

export interface CurrentPoints {
  own: number,
  opponent: number
}

export interface ClubTeam {
  clubId: number,
  teamName: string,
  championship: string,
  championshipName: string,
  groupId: number,
  groupName: string,
  captainDisplayName: string | undefined,
  currentRanking: number | undefined,
  currentPoints: CurrentPoints | undefined,
}

export async function scrapeClubTeams(clubId: number, federation: Pick<Federation, 'rootURL'>): Promise<ClubTeam[]> {
  const url = buldSearchURL(clubId, federation);

  const html = await download(url);

  return scrapeFromHTML(clubId, html);
}

function buldSearchURL(clubId: number, federation: Pick<Federation, 'rootURL'>): string {
  return `${federation.rootURL}/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubTeams?club=${clubId}`;
}

function scrapeFromHTML(clubId: number, html: string): ClubTeam[] {
  const result: ClubTeam[] = [];

  const $ = cheerio.load(html);

  const rows = $('table[class="result-set"] > tbody > tr');
  let currentChapionshipName = '';

  for (let i = 0; i < rows.length; i++) {
    const $row = cheerio.load(rows[i]);
    // console.log('row: ', $row);

    const nextCSName = $row('h2').text();
    if (nextCSName) {
      currentChapionshipName = nextCSName;
      i++; // skip intermediate header row
    } else {
      const entry = scrapeEntry($row, currentChapionshipName, clubId);
      result.push(entry);
    }

  }

  return result;
}

function scrapeEntry($row: CheerioStatic, championshipName: string, clubId: number): ClubTeam {
  const teamName = clean($row('tr td:nth-of-type(1)').text());
  const championship = parseChampionshipFromURL(clean($row('tr td:nth-of-type(2) a').attr('href')));
  const groupId = parseGroupIdFromURL(clean($row('tr td:nth-of-type(2) a').attr('href')));
  const groupName = clean($row('tr td:nth-of-type(2) a').text());
  const captainDisplayName = parseCaptainDisplayName(clean($row('tr td:nth-of-type(3)').text()));
  const currentRanking = parseCurrentRanking(clean($row('tr td:nth-of-type(4)').text()));
  const currentPoints = parseCurrentPoints(clean($row('tr td:nth-of-type(5)').text()));

  const result = {
    clubId,
    teamName,
    championship,
    championshipName,
    groupId,
    groupName,
    captainDisplayName,
    currentRanking,
    currentPoints,
  };

  return result;
}

function parseChampionshipFromURL(searchURL: string): string {
  // example: https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/groupPage?championship=STT+20%2F21&group=207086

  const matches = /championship=(.*?)(&|$)/.exec(searchURL);
  if (!matches) {
    return '';
  }

  const match = matches[1];

  const result = myDecodeURIComponent(match);

  return result;

}

function parseGroupIdFromURL(searchURL: string): number {
  // example: https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/groupPage?championship=STT+20%2F21&group=207086

  const matches = /group=(.*?)(&|$)/.exec(searchURL);
  if (!matches) {
    return -1;
  }

  const match = matches[1];

  const idText = myDecodeURIComponent(match);

  const result = parseInt(idText, 10);

  return result;
}

function parseCurrentPoints(s: string): CurrentPoints | undefined {
  // example: 10:6

  if (!s) {
    return undefined;
  }

  const split = s.split(':');
  const own = parseInt(split[0], 10);
  const opponent = parseInt(split[1], 10);

  return {own, opponent};
}

function parseCurrentRanking(s: string): number | undefined {
  if (!s) {
    return undefined;
  }

  return parseInt(s, 10);
}

function parseCaptainDisplayName(s: string): string | undefined {
  if (!s) {
    return undefined;
  }

  return s;
}

