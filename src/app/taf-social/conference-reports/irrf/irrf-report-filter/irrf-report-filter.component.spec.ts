import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IrrfReportFilterComponent } from './irrf-report-filter.component';

xdescribe(IrrfReportFilterComponent.name, () => {
  let component: IrrfReportFilterComponent;
  let fixture: ComponentFixture<IrrfReportFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrrfReportFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrrfReportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
