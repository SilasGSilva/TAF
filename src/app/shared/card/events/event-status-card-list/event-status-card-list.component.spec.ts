import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventStatusCardListComponent } from './event-status-card-list.component';

xdescribe('EventStatusCardListComponent', () => {
  let component: EventStatusCardListComponent;
  let fixture: ComponentFixture<EventStatusCardListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventStatusCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventStatusCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
