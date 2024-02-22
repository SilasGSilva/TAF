import { of } from 'rxjs';
import { ESocialVersion, TotvsPage } from '../../../app/models/labor-process.model';
import { HttpServiceMock } from '../../../util/test/mock/http-service.mock';
import { HttpService } from '../../core/services/http.service';
import { ESocialVersionService } from './e-social-version.service';

describe(ESocialVersionService.name, () => {
  let service: ESocialVersionService;
  let httpService: HttpService;

  beforeEach(() => {
    httpService = new HttpServiceMock() as unknown as HttpService;

    service = new ESocialVersionService(httpService);
  });

  describe(ESocialVersionService.prototype.get.name, () => {
    it('should return the version', () => {
      const mockCompanyId = '42';
      const mockBranchId = '24';
      const expectedUrl = '/api/rh/v1/eSocialLayoutVersion';

      spyOn(httpService, 'get').and.returnValue(of({} as TotvsPage<ESocialVersion>));

      service.get(mockCompanyId, mockBranchId);

      expect(httpService.get).toHaveBeenCalledWith(
        expectedUrl,
        { companyId: mockCompanyId, branchId: mockBranchId },
      );
    });
  });
});
