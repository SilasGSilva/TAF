import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FgtsReportSyntheticChartComponent } from './fgts-report-synthetic-chart.component';

xdescribe('FgtsReportSyntheticChartComponent', () => {
  let component: FgtsReportSyntheticChartComponent;
  let fixture: ComponentFixture<FgtsReportSyntheticChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FgtsReportSyntheticChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgtsReportSyntheticChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
