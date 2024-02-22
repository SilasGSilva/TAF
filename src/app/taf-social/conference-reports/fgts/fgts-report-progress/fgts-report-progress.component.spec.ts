import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FgtsReportProgressComponent } from './fgts-report-progress.component';

xdescribe('FgtsReportProgressComponent', () => {
  let component: FgtsReportProgressComponent;
  let fixture: ComponentFixture<FgtsReportProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FgtsReportProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgtsReportProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
