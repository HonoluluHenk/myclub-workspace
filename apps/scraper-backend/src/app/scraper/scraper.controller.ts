import {Controller, Get} from '@nestjs/common';
import {
  ClubListEntry,
  Federation,
  FEDERATION_STT,
  scrapeClubSearchList,
  scrapeClubSearchOptions,
} from '../../../../../libs/scraper/src/lib/club';
import {flatMap} from 'lodash';
import {ClubTeam, scrapeClubTeams} from '../../../../../libs/scraper/src/lib/club/scrapeClubTeams';

interface ExtendedClubListEntry extends ClubListEntry {
  teams: ClubTeam[]
}

async function scrapeExtendedClubListEntry(c: ClubListEntry, federation: Federation): Promise<ExtendedClubListEntry> {
  const teams = await scrapeClubTeams(c.clubId, federation);
  return {
    ...c,
    teams,
  };
}

@Controller('scraper')
export class ScraperController {

  @Get('clubs')
  async findClubScheduleForSeason(): Promise<ExtendedClubListEntry[]> {
    const federation = FEDERATION_STT;

    const clubSearchOptions = await scrapeClubSearchOptions(federation);
    const clubLists = await Promise.all(clubSearchOptions.map(cso => scrapeClubSearchList(cso)));
    const clubs = flatMap<ClubListEntry>(clubLists);

    const result = [];
    for (const club of clubs) {
      result.push(await scrapeExtendedClubListEntry(club, federation));
    }

    return result;
  }
}
