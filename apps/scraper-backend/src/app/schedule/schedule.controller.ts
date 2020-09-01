import { ScrapedClubSchedule } from "@myclub/scraper";
import { Controller, Get, Header, Param } from "@nestjs/common";
import * as ical from "ical-generator";
import { ClubScheduleScraper } from "../scraper/club-schedule-scraper";
import {DateTime} from 'luxon';

function buildEncounterSummary(ts: ScrapedClubSchedule, homeTeam: string) {
  const home = ts.homeTeam === homeTeam;
  if (home) {
    return `TT H: ${ts.guestTeam}`;
  }

  return `TT A: ${ts.homeTeam}`;
}

function createIcal(description: string, team: string, schedule: ScrapedClubSchedule[]): string {
  const cal = ical({
    domain: "myclub",
    name: team,
    description
  });

  const teamSchedule = schedule
    .filter(s => !s.teamCancelled)
    .filter(s => s.homeTeam === team || s.guestTeam === team);

  console.log("length:", teamSchedule.length);

  teamSchedule
    .forEach(ts => {
      cal.createEvent({
        id: `${ts.homeTeam}===${ts.guestTeam}`,
        start: ts.localDateTimeAsUTC,
        end: DateTime.fromJSDate(ts.localDateTimeAsUTC).plus({hours: 2}).toJSDate(),
        summary: buildEncounterSummary(ts, team),
        // description: builder.buildEncounterDescription(encounter, params),
        // location: builder.buildEncounterLocation(encounter, params),
        stamp: DateTime.utc().toJSDate(),
      });
    });

  const result = cal.toString();

  console.log("ical", result);
  return result;
}

@Controller("schedule")
export class ScheduleController {
  constructor(private readonly scraper: ClubScheduleScraper) {
  }

  @Get(":championship/:groupId")
  async findSchedulesForSeason(
    @Param("championship") championship: string,
    @Param("groupId") groupId: number
  ) {
    const result = await this.scraper.scrape(championship, groupId);
    console.log("result", championship, groupId, result);
    return result;
  }

  @Get(":season/:clubId/:teamId/ical")
  @Header("content-type", "text/calendar")
  @Header("content-disposition", "attachment;filename=" + encodeURIComponent("foo.ics"))
  async findSchedulesForSeasonAsIcal(
    @Param("season") season: string,
    @Param("clubId") clubId: number,
    @Param("teamId") teamId: string
    // @Res() response: Response
  ) {
    const schedule = await this.scraper.scrape(season, clubId);
    if (!schedule) {
      throw new Error(`could not scrape: ${season}/${clubId}`);
    }

    const icalData = createIcal(`Schedule`, "Ostermundigen IV", schedule);

    return icalData;
  }
}

