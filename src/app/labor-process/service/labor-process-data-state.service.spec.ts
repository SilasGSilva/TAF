import { of } from 'rxjs';
import { PoNotificationService } from '@po-ui/ng-components';
import { ESocialVersionEnum } from '../../models/labor-process.model';
import { ESocialVersionServiceMock } from '../../../util/test/mock/e-social-version-service.mock';
import { PoNotificationServiceMock } from '../../../util/test/mock/po-components/po-notification-service.mock';
import { LaborProcessDataState, LaborProcessDataStateService } from './labor-process-data-state.service';
import { ESocialVersionService } from './e-social-version.service';

describe(LaborProcessDataStateService.name, () => {
  let service: LaborProcessDataStateService;
  let eSocialVersionService: ESocialVersionService;
  let notificationService: PoNotificationService;

  beforeEach(() => {
    eSocialVersionService = new ESocialVersionServiceMock() as ESocialVersionService;
    notificationService = new PoNotificationServiceMock() as unknown as PoNotificationService;
    
    service = new LaborProcessDataStateService(eSocialVersionService, notificationService);
  });

  it('should initialize the state', () => {
    const state = service.snapshot;
    const expectedState: LaborProcessDataState = {
      version: null,
      branchId: '',
      companyId: '',
      userName: '',
    };

    expect(state).toEqual(expectedState);
  });

  describe(LaborProcessDataStateService.prototype.setData.name, () => {
    it('should update the data state', async () => {
      const expectedState = ESocialVersionEnum.v1;

      await service.setData();

      expect(service.snapshot.version).toEqual(expectedState);
    });
  });

  describe(LaborProcessDataStateService.prototype.getVersion.name, () => {
    it('should return the correct version', async () => {
      await service.setData();
      const result = service.getVersion();

      expect(result).toEqual(ESocialVersionEnum.v1);
    }); 

    describe('when the version is NOT correct', () => {
      beforeEach(async () => {
        const mockApiResult = {
          items: [
            {
              eSocialLayoutVersion: 8001,
            }
          ],
          hasNext: false,
        };
  
        spyOn(eSocialVersionService, 'get').and.returnValue(of(mockApiResult));
        await service.setData();
      });

      it('should return NULL', () => {
        const result = service.getVersion();

        expect(result).toBeNull();
      });

      it('should NOT raise an error notification by default', () => {
        spyOn(notificationService, 'error');
        service.getVersion();

        expect(notificationService.error).toHaveBeenCalledTimes(0);
      });

      it('should raise an error notification when called with TRUE param', () => {
        const showError = true;

        spyOn(notificationService, 'error');
        service.getVersion(showError);

        expect(notificationService.error).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe(LaborProcessDataStateService.prototype.getBranchId.name, () => {
    const branchId = 'mockBranchId';

    beforeEach(() => {
      const TAFCompany = JSON.stringify({ branch_code: branchId });
      sessionStorage.setItem('TAFCompany', TAFCompany);
    });

    it('should return the correct branchId', async () => {
      await service.setData();
      const result = service.getBranchId();

      expect(result).toEqual(branchId);
    }); 
  });

  describe(LaborProcessDataStateService.prototype.getCompanyId.name, () => {
    const companyId = 'mockCompanyId';

    beforeEach(() => {
      const TAFCompany = JSON.stringify({ company_code: companyId });
      sessionStorage.setItem('TAFCompany', TAFCompany);
    });

    it('should return the correct companyId', async () => {
      await service.setData();
      const result = service.getCompanyId();

      expect(result).toEqual(companyId);
    }); 
  });

  describe(LaborProcessDataStateService.prototype.getUserName.name, () => {
    const userName = 'mockUserName';

    beforeEach(() => {
      sessionStorage.setItem('username', userName);
    });

    it('should return the correct version', async () => {
      await service.setData();
      const result = service.getUserName();

      expect(result).toEqual(userName);
    }); 
  });
});
