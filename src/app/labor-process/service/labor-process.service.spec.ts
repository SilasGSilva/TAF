import { of } from 'rxjs';
import { ESocialVersionEnum, LaborProcess, TotvsPage } from '../../../app/models/labor-process.model';
import { HttpServiceMock } from '../../../util/test/mock/http-service.mock';
import { LaborProcessDataStateServiceMock } from '../../../util/test/mock/labor-process-data-state-service.mock';
import { HttpService } from '../../core/services/http.service';
import { LaborProcessDataStateService } from './labor-process-data-state.service';
import { LaborProcessService } from './labor-process.service';

describe(LaborProcessService.name, () => {
  let httpService: HttpService;
  let laborProcessDataStateService: LaborProcessDataStateService;
  let service: LaborProcessService;

  beforeEach(() => {
    httpService = new HttpServiceMock() as unknown as HttpService;
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;

    service = new LaborProcessService(httpService, laborProcessDataStateService);
  });

  describe('baseVersionUrl', () => {
    it('should return correct api if the state return correct version', () => {
      const versionNumbers = Object.keys(ESocialVersionEnum).filter(key => Number(key)).map(key => Number(key));
      const versions = versionNumbers.map(versionNumber => ESocialVersionEnum[versionNumber]);
      
      spyOn(laborProcessDataStateService, 'getVersion').and.returnValues(...versionNumbers);

      versions.forEach(version => {
        const result = service.baseVersionUrl;

        expect(result).withContext(`Version: ${version}`).toEqual(`/api/rh/${version}/laborProcess`);
      });
    });
  });

  it(`${LaborProcessService.prototype.get.name} should be called`, () => {
    spyOn(httpService, 'get').and.returnValue(of({} as TotvsPage<LaborProcess>));
    service.get(0, 0, '', '');
    expect(httpService.get).toHaveBeenCalled();
  });

  it(`${LaborProcessService.prototype.getSimple.name} should be called`, () => {
    spyOn(httpService, 'get').and.returnValue(of({} as TotvsPage<LaborProcess>));
    service.getSimple('');
    expect(httpService.get).toHaveBeenCalled();
  });

  it(`${LaborProcessService.prototype.update.name} should be called`, () => {
    spyOn(httpService, 'put').and.returnValue(of({} as TotvsPage<LaborProcess>));
    service.update('', true, []);
    expect(httpService.put).toHaveBeenCalled();
  });

  it(`${LaborProcessService.prototype.delete.name} should be called`, () => {
    spyOn(httpService, 'delete').and.returnValue(of({}));
    service.delete('');
    expect(httpService.delete).toHaveBeenCalled();
  });

  it(`${LaborProcessService.prototype.post.name} should be called`, () => {
    spyOn(httpService, 'post').and.returnValue(of({} as TotvsPage<LaborProcess>));
    service.post(true, []);
    expect(httpService.post).toHaveBeenCalled();
  });
});
