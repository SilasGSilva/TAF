import { TestBed } from '@angular/core/testing';
import { SocialUserFilterService } from './social-user-filter.service';

xdescribe('SocialUserFilterService', () => {
  let service: SocialUserFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialUserFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
