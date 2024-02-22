import { TestBed } from '@angular/core/testing';

import { ReportValidationTableService } from './report-validation-table.service';

xdescribe('ReportValidationTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportValidationTableService = TestBed.get(ReportValidationTableService);
    expect(service).toBeTruthy();
  });
});
