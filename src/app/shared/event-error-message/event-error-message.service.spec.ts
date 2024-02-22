import { TestBed } from '@angular/core/testing';

import { EventErrorMessageService } from './event-error-message.service';

xdescribe('EventErrorMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: EventErrorMessageService = TestBed.get(EventErrorMessageService);
    expect(service).toBeTruthy();
  });
});
