import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartViewFilterComponent } from './sv-filter.component';

xdescribe('SmartViewFilterComponent', () => {
  let component: SmartViewFilterComponent;
  let fixture: ComponentFixture<SmartViewFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartViewFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartViewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
