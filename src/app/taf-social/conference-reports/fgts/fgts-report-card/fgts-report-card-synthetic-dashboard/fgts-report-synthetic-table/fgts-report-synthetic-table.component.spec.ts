import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FgtsReportSyntheticTableComponent } from './fgts-report-synthetic-table.component';

xdescribe('FgtsReportSyntheticTableComponent', () => {
  let component: FgtsReportSyntheticTableComponent;
  let fixture: ComponentFixture<FgtsReportSyntheticTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FgtsReportSyntheticTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgtsReportSyntheticTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
