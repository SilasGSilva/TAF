import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FgtsReportFilterComponent } from './fgts-report-filter.component';

xdescribe('FgtsReportFilterComponent', () => {
  let component: FgtsReportFilterComponent;
  let fixture: ComponentFixture<FgtsReportFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FgtsReportFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgtsReportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
