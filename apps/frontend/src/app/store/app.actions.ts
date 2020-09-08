import { ClubSchedule } from "@myclub/scraper";

export namespace Actions {
  export class LoadScrapedSchedule {
    static type = "[Schedule] LoadScrapedSchedule";

    constructor(public readonly season: string, public readonly clubId: number) {
    }
  }

  export class ScrapedScheduleLoaded {
    static type = "[Schedule] ScrapedScheduleLoaded";

    constructor(public readonly schedule: ClubSchedule[]) {
    }
  }
}

export namespace GlobalActions {

  export class ShowError {
    static type = "[Global] ShowError";

    constructor(public readonly message: string, error: any) {
    }
  }
}
