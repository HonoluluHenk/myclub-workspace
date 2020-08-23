import { ScrapedClubSchedule } from "@myclub/scraper";

export interface AppStateModel {
  scrapedClubSchedules: ScrapedClubSchedule[],
  searchScheduleForm: {
    model: any,
    dirty: boolean,
    status: string,
    errors: { [key: string]: any }
  }
}
