import { TestBed } from '@angular/core/testing';
import { SmartViewFilterService } from './sv-filter.service';

xdescribe('SmartViewFilterService', () => {
  let service: SmartViewFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartViewFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});