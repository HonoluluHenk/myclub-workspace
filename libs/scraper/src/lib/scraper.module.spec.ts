import { async, TestBed } from '@angular/core/testing';
import { ScraperModule } from './scraper.module';

describe('ScraperModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ScraperModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ScraperModule).toBeDefined();
  });
});
