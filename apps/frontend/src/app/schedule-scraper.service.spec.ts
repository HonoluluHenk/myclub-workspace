import { TestBed } from '@angular/core/testing';

import { ScheduleScraperService } from './schedule-scraper.service';

describe('ScheduleScraperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduleScraperService = TestBed.get(ScheduleScraperService);
    expect(service).toBeTruthy();
  });
});
