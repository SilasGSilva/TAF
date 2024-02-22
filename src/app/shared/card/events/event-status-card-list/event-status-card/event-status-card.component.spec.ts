import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventStatusCardComponent } from './event-status-cards.component';

xdescribe('EventStatusCardCardsComponent', () => {
  let component: EventStatusCardComponent;
  let fixture: ComponentFixture<EventStatusCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventStatusCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
