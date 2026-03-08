import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EllaYalaTwoDayTour } from './ella-yala-two-day-tour';

describe('EllaYalaTwoDayTour', () => {
  let component: EllaYalaTwoDayTour;
  let fixture: ComponentFixture<EllaYalaTwoDayTour>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EllaYalaTwoDayTour]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EllaYalaTwoDayTour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
