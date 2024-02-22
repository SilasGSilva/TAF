import { TestBed } from '@angular/core/testing';

import { RemoveCompanyService } from './remove-company.service';

xdescribe('RemoveCompanyService', () => {
  let service: RemoveCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveCompanyService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
