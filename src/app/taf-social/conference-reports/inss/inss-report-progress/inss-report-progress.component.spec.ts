import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InssReportProgressComponent } from './inss-report-progress.component';

describe(InssReportProgressComponent.name, () => {
  let component: InssReportProgressComponent;
  let fixture: ComponentFixture<InssReportProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InssReportProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InssReportProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`deve crirar o componente ${InssReportProgressComponent.name}`, () => {
    expect(component).toBeTruthy();
  });
});
