import { ClubSchedule } from "@myclub/scraper";
import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import produce from "immer";
import { ScheduleScraperService } from "../schedule-scraper.service";
import { Actions, GlobalActions } from "./app.actions";
import { AppStateModel } from "./app.model";

export const APP_STATE = new StateToken<AppStateModel>("app");

@State<AppStateModel>({
  name: APP_STATE,
  defaults: {
    scrapedClubSchedules: [],
    searchScheduleForm: {
      model: undefined,
      dirty: false,
      status: "",
      errors: {}
    }
  }
})
export class AppState {
  constructor(private readonly scheduleScraper: ScheduleScraperService) {
  }

  @Selector()
  static schedules(state: AppStateModel): ClubSchedule[] {
    return state.scrapedClubSchedules;
  }

  @Selector()
  static teams(state: AppStateModel): void {
//FIXME: filter teams
  }

  @Action(Actions.LoadScrapedSchedule)
  loadSchedule(ctx: StateContext<AppStateModel>, action: Actions.LoadScrapedSchedule): void {
    this.scheduleScraper.scrapeClubSchedule$(action.clubId, action.season)
      .subscribe(
        next => ctx.dispatch(new Actions.ScrapedScheduleLoaded(next)),
        error => ctx.dispatch(new GlobalActions.ShowError("Could not laod schedule", error))
      );
  }

  @Action(Actions.ScrapedScheduleLoaded)
  scrapedScheduleLoaded(ctx: StateContext<AppStateModel>, action: Actions.ScrapedScheduleLoaded): void {
    ctx.setState(produce((draft: AppStateModel) => {
      draft.scrapedClubSchedules = action.schedule
    }));
  }
}
