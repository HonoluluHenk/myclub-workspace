import {Controller, Get} from '@nestjs/common';
import {
  ClubListEntry,
  ClubTeam,
  Federation,
  FEDERATION_STT,
  scrapeClubSearchList,
  scrapeClubSearchOptions,
  scrapeClubTeams,
} from '@myclub/scraper';
import {flatMap} from 'lodash';
import PromisePool from 'es6-promise-pool';

interface ExtendedClubListEntry extends ClubListEntry {
  teams: ClubTeam[]
}

async function scrapeExtendedClubListEntry(c: ClubListEntry, federation: Federation, result: ExtendedClubListEntry[]): Promise<void> {
  // console.debug('scrapeExtended: ', c.clubId);
  const teams = await scrapeClubTeams(c.clubId, federation);
  result.push({
    ...c,
    teams,
  });
}

@Controller('scraper')
export class ScraperController {

  @Get('clubs')
  async findClubScheduleForSeason(): Promise<ExtendedClubListEntry[]> {
    const federation = FEDERATION_STT;

    const clubSearchOptions = await scrapeClubSearchOptions(federation);
    const clubLists = await Promise.all(clubSearchOptions.map(cso => scrapeClubSearchList(cso)));
    const clubs = flatMap<ClubListEntry>(clubLists);

    const result: ExtendedClubListEntry[] = [];

    const generatePromises = function* () {
      for (let i = 1; i < clubs.length; i++) {
        yield scrapeExtendedClubListEntry(clubs[i], federation, result);
      }
      return 'Finished!';
    };

    const iter = generatePromises() as any;
    const pool = new PromisePool<ExtendedClubListEntry[]>(iter, 5);
    await pool.start();

    return result;
  }
}
