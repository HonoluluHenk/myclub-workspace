import { async, TestBed } from '@angular/core/testing';
import { MyclubSharedModule } from './myclub-shared.module';

describe('MyclubSharedModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MyclubSharedModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(MyclubSharedModule).toBeDefined();
  });
});
