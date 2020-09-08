import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { ClubSchedule } from "@myclub/scraper";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ScheduleScraperService {

  constructor(private readonly http: HttpClient) { }

  public scrapeClubSchedule$(clubId: number, season: string): Observable<ClubSchedule[]> {
    return this.http.get<ClubSchedule[]>(`/api/v1/schedule/${encodeURIComponent(season)}/${encodeURIComponent(clubId)}`
    )
      .pipe(tap(resp => console.log("resp", resp)))
    // FIXME: error handling
  }
}
