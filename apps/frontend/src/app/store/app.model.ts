import { ClubSchedule } from "@myclub/scraper";

export interface AppStateModel {
  scrapedClubSchedules: ClubSchedule[],
  searchScheduleForm: {
    model: any,
    dirty: boolean,
    status: string,
    errors: { [key: string]: any }
  }
}
