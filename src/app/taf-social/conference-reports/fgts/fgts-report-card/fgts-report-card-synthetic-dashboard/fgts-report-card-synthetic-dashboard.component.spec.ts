import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FgtsReportCardSyntheticDashboardComponent } from './fgts-report-card-synthetic-dashboard.component';

xdescribe('FgtsReportCardSyntheticDashboardComponent', () => {
  let component: FgtsReportCardSyntheticDashboardComponent;
  let fixture: ComponentFixture<FgtsReportCardSyntheticDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FgtsReportCardSyntheticDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgtsReportCardSyntheticDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
