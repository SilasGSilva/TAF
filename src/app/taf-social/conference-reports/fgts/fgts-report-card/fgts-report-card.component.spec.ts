import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FgtsReportCardComponent } from './fgts-report-card.component';

xdescribe('FgtsReportCardComponent', () => {
  let component: FgtsReportCardComponent;
  let fixture: ComponentFixture<FgtsReportCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FgtsReportCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgtsReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
