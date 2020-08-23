import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ScrapedClubSchedule } from "@myclub/scraper";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { Actions } from "./store/app.actions";
import { AppState } from "./store/app.state";

@Component({
  selector: "myclub-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "frontend";

  public form: FormGroup;

  @Select(AppState.schedules) schedules$!: Observable<ScrapedClubSchedule[]>;

  constructor(
    fb: FormBuilder,
    private readonly store: Store
  ) {
    this.form = fb.group({
      club: [""],
      season: [""]
    });

  }

  public search() {
    this.store.dispatch(new Actions.LoadScrapedSchedule("13-2870", 33282));
  }
}
