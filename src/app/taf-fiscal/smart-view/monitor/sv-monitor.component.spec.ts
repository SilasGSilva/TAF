import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartViewMonitorComponent } from './sv-monitor.component';

xdescribe('SmartViewMonitorComponent', () => {
  let component: SmartViewMonitorComponent;
  let fixture: ComponentFixture<SmartViewMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartViewMonitorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartViewMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
