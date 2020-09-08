import { TestBed } from '@angular/core/testing';

import { ScheduleScraperService } from './schedule-scraper.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ScheduleScraperService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: ScheduleScraperService = TestBed.inject(ScheduleScraperService);
    expect(service).toBeTruthy();
  });
});
