import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { take } from "rxjs/operators";
import { ScrapedClubSchedule } from "./ScrapedClubSchedule";

const data: ScrapedClubSchedule[] = require("/sampledata/ostermundigen-2019-20.json");

@Injectable({
  providedIn: "root"
})
export class ScraperService {

  constructor(private readonly http: HttpClient) {
  }

  public loadClubSchedule(
    clubId: number,
    timeRange: string
  ): Observable<ScrapedClubSchedule[]> {
    //FIXME: implement backend service
    return of(data)
      .pipe(take(1));
  }
}
