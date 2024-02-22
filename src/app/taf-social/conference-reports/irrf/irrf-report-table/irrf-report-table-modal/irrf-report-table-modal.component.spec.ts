import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IrrfReportTableModalComponent } from './irrf-report-table-modal.component';

xdescribe(IrrfReportTableModalComponent.name, () => {
  let component: IrrfReportTableModalComponent;
  let fixture: ComponentFixture<IrrfReportTableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrrfReportTableModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrrfReportTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});