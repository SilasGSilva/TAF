import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IrrfReportCardComponent } from './irrf-report-card.component';

describe(IrrfReportCardComponent.name, () => {
  let component: IrrfReportCardComponent;
  let fixture: ComponentFixture<IrrfReportCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrrfReportCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrrfReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
