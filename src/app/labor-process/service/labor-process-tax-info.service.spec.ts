import { of } from 'rxjs';
import { ProcessTax, SimpleProcessTax } from '../../../app/models/labor-process-taxes.model';
import { ESocialVersionEnum, TotvsPage } from '../../../app/models/labor-process.model';
import { HttpServiceMock } from '../../../util/test/mock/http-service.mock';
import { LaborProcessDataStateServiceMock } from '../../../util/test/mock/labor-process-data-state-service.mock';
import { HttpService } from '../../core/services/http.service';
import { LaborProcessDataStateService } from './labor-process-data-state.service';
import { LaborProcessTaxInfoService } from './labor-process-tax-info.service';

describe(LaborProcessTaxInfoService.name, () => {
  let httpService: HttpService;
  let laborProcessDataStateService: LaborProcessDataStateService;

  let service: LaborProcessTaxInfoService;

  beforeEach(() => {
    httpService = new HttpServiceMock() as unknown as HttpService;
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;

    service = new LaborProcessTaxInfoService(httpService, laborProcessDataStateService);
  });

  describe('baseVersionProcessTaxUrl getter', () => {
    it('should return correct api if the state return correct version', () => {
      const versionNumbers = Object.keys(ESocialVersionEnum).filter(key => Number(key)).map(key => Number(key));
      const versions = versionNumbers.map(versionNumber => ESocialVersionEnum[versionNumber]);
      
      spyOn(laborProcessDataStateService, 'getVersion').and.returnValues(...versionNumbers);

      versions.forEach(version => {
        const result = service.baseVersionProcessTaxUrl;

        expect(result).withContext(`Version: ${version}`).toEqual(`/api/rh/${version}/laborProcessTaxes`);
      });
    });
  });

  describe(LaborProcessTaxInfoService.prototype.getAll.name, () => {
    it('should called get with all parameters', () => {
      let url = `${service.baseVersionProcessTaxUrl}?page=1&pageSize=10`;
      url += `&companyId=mockCompanyId`;
      url += `&branchId=mockBranchId`;
      url += `&nrProcTrab=npTrab`;
      url += `&perApurPagto=paPagto`;
      url += `&userName=mockUserName`;
      spyOn(httpService, 'get').withArgs(url).and.returnValue(of({} as TotvsPage<SimpleProcessTax>));
      service.getAll(1, 10, 'npTrab', 'paPagto');
      expect(httpService.get).toHaveBeenCalled();
    });
  });

  describe(LaborProcessTaxInfoService.prototype.get.name, () => {
    it('should called get with all parameters', () => {
      let url = `${service.baseVersionProcessTaxUrl}/123`;
      url += `?userName=mockUserName`;
      spyOn(httpService, 'get').withArgs(url).and.returnValue(of({} as TotvsPage<ProcessTax>));
      service.get('123');
      expect(httpService.get).toHaveBeenCalled();
    });
  });

  describe(LaborProcessTaxInfoService.prototype.create.name, () => {
    const processTax: ProcessTax = {
      excluidoERP: 'N',
      branchId: 'bId',
      companyId: 'cId',
      userName: 'uName',
      ideTrab: [],
      ideProc: null
    };
    const requestBody = {
      hasNext: false,
      items: [processTax],
    };

    it('should called get with all parameters', () => {
      let url = `${service.baseVersionProcessTaxUrl}?companyId=mockCompanyId `;
      url += `&branchId=mockBranchId `;
      url += `&userName=mockUserName `;
      spyOn(httpService, 'post').withArgs(url, requestBody).and.returnValue(of({} as TotvsPage<ProcessTax>));
      service.create(processTax);
      expect(httpService.post).toHaveBeenCalled();
    });
  });

  describe(LaborProcessTaxInfoService.prototype.edit.name, () => {
    const processTax: ProcessTax = {
      excluidoERP: 'N',
      branchId: 'bId',
      companyId: 'cId',
      userName: 'uName',
      ideTrab: [],
      ideProc: null
    };
    const requestBody = {
      hasNext: false,
      items: [processTax],
    };

    it('should called get with all parameters', () => {
      let url = `${service.baseVersionProcessTaxUrl}/123`;
      url += `?userName=mockUserName `;
      spyOn(httpService, 'put').withArgs(url, requestBody).and.returnValue(of({} as TotvsPage<ProcessTax>));
      service.edit('123', processTax);
      expect(httpService.put).toHaveBeenCalled();
    });
  });

  describe(LaborProcessTaxInfoService.prototype.delete.name, () => {
    it('should called get with all parameters', () => {
      let url = `${service.baseVersionProcessTaxUrl}/123`;
      url += `?userName=mockUserName`;
      spyOn(httpService, 'delete').withArgs(url).and.returnValue(of({} as TotvsPage<ProcessTax>));
      service.delete('123');
      expect(httpService.delete).toHaveBeenCalled();
    });
  });

  describe(LaborProcessTaxInfoService.prototype.getProcessWorkers.name, () => {
    it('should called get with all parameters', () => {
      let url = `${service.EMPLOYEES_URL}/mockCompanyId;mockBranchId;npTrab`;
      url += `?userName=mockUserName`;
      spyOn(httpService, 'get').withArgs(url).and.returnValue(of({} as TotvsPage<ProcessTax>));
      service.getProcessWorkers('npTrab');
      expect(httpService.get).toHaveBeenCalled();
    });
  });
});
