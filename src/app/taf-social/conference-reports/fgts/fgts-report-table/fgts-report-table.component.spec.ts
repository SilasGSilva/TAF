import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FgtsReportTableComponent } from './fgts-report-table.component';

xdescribe('FgtsReportTableComponent', () => {
  let component: FgtsReportTableComponent;
  let fixture: ComponentFixture<FgtsReportTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FgtsReportTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgtsReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
