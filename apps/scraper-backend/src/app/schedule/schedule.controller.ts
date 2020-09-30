import {Controller, Get, Header, Param} from '@nestjs/common';
import ical from 'ical-generator';
import {DateTime} from 'luxon';
import {ClubSchedule, scrapeClubSchedule} from '@myclub/scraper';

@Controller('schedule')
export class ScheduleController {

  @Get(':seasonStartYear/:clubId')
  async findClubScheduleForSeason(
    @Param('seasonStartYear') seasonStartYear: string,
    @Param('clubId') clubId: string,
  ) {
    console.log('scrape:', seasonStartYear, clubId);
    const result = await scrapeClubSchedule(
      parseInt(seasonStartYear, 10),
      parseInt(clubId, 10),
    );
    // console.log('result:', seasonStartYear, clubId, result);
    return result;
  }

  @Get(':seasonStartYear/:clubId/:teamId')
  async findClubScheduleForSeasonAndTeam(
    @Param('seasonStartYear') seasonStartYear: string,
    @Param('clubId') clubId: string,
    @Param('teamId') teamId: string,
  ) {
    console.log('scrape:', seasonStartYear, clubId);
    const result = await scrapeClubSchedule(
      parseInt(seasonStartYear, 10),
      parseInt(clubId, 10),
      parseInt(teamId, 10),
    );
    // console.log('result:', seasonStartYear, clubId, result);
    return result;
  }

  @Get(':seasonStartYear/:clubId/:teamId/ical/:teamName')
  @Header('content-type', 'text/calendar')
  @Header('content-disposition', 'attachment;filename=' + encodeURIComponent('team-schedule.ics'))
  async findSchedulesForSeasonAsIcal(
    @Param('seasonStartYear') seasonStartYear: string,
    @Param('clubId') clubId: string,
    @Param('teamId') teamId: string,
    @Param('teamName') teamName: string,
    // @Res() response: Response
  ) {
    const schedule = await scrapeClubSchedule(
      parseInt(seasonStartYear, 10),
      parseInt(clubId, 10),
      parseInt(teamId, 10),
    );
    if (!schedule) {
      throw new Error(`could not scrape: ${seasonStartYear}/${clubId}`);
    }

    const icalData = createIcal(`Schedule`, teamName, schedule);

    return icalData;
  }
}

function buildEncounterSummary(ts: ClubSchedule, homeTeam: string) {
  const home = ts.homeTeam === homeTeam;
  if (home) {
    return `TT H: ${ts.guestTeam}`;
  }

  return `TT A: ${ts.homeTeam}`;
}

function createIcal(description: string, team: string, schedule: ClubSchedule[]): string {
  const cal = ical({
    domain: 'myclub',
    name: team,
    description,
    // timezone: 'GMT+2',
    timezone: 'Europe/Zurich',
  });

  const teamSchedule = schedule
    .filter(s => !s.teamCancelled)
    .filter(s => s.homeTeam === team || s.guestTeam === team);

  console.log('length:', teamSchedule.length);

  teamSchedule
    .forEach(ts => {
      cal.createEvent({
        id: `${ts.homeTeam}===${ts.guestTeam}`,
        start: ts.startDateTime,
        end: DateTime.fromJSDate(ts.startDateTime)
          .plus({hours: 2})
          .toJSDate(),
        summary: buildEncounterSummary(ts, team),
        // description: builder.buildEncounterDescription(encounter, params),
        // location: builder.buildEncounterLocation(encounter, params),
        stamp: DateTime.utc().toJSDate(),
      });
    });

  const result = cal.toString();

  console.log('ical', result);
  return result;
}
