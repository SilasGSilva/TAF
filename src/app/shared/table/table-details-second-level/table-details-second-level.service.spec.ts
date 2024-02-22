import { TestBed } from '@angular/core/testing';

import { TableDetailsSecondLevelService } from './table-details-second-level.service';

xdescribe('TableDetailsSecondLevelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TableDetailsSecondLevelService = TestBed.get(TableDetailsSecondLevelService);
    expect(service).toBeTruthy();
  });
});
