import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransmissionComponent } from './transmission.component';

xdescribe('TransmissionComponent', () => {
  let component: TransmissionComponent;
  let fixture: ComponentFixture<TransmissionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
