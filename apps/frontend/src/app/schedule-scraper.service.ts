import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { ScrapedClubSchedule } from "@myclub/scraper";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ScheduleScraperService {

  constructor(private readonly http: HttpClient) { }

  public scrapeClubSchedule$(clubId: number, season: string): Observable<ScrapedClubSchedule[]> {
    return this.http.get<ScrapedClubSchedule[]>(`/api/v1/schedule/${encodeURIComponent(season)}/${encodeURIComponent(clubId)}`
    )
      .pipe(tap(resp => console.log("resp", resp)))
    // FIXME: error handling
  }
}
