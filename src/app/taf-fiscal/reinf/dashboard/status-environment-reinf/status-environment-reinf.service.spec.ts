import { HttpService } from 'core/services/http.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, Subscription } from 'rxjs';
import { StatusEnvironmentReinfService } from './status-environment-reinf.service';
import { StatusEnvironmentResponse } from '../../../../models/status.environment-response';

beforeEach(() => {
  const TAFCompany = {
    company_code: 'T1',
    branch_code: 'D MG 01',
  };

  const company = JSON.stringify(TAFCompany);

  const ERPAPPCONFIG = {
    name: 'Protheus THF',
    version: '12.23.0',
    serverBackend: '/',
    restEntryPoint: 'rest',
    versionAPI: '',
    appVersion: '0.1.6',
    productLine: 'Protheus'
  };

  const config = JSON.stringify(ERPAPPCONFIG);

  const statusEnvironment = {
    statusEnvironment: 'production',
    layoutReinf: '1_05_10',
    entidadeTSS: '000001'
  };

  sessionStorage.setItem('TAFCompany', company);
  sessionStorage.setItem('ERPAPPCONFIG', config);
  sessionStorage.setItem('statusEnvironment', JSON.stringify(statusEnvironment));

});

xdescribe('StatusEnvironmentReinfService', () => {
  let service: StatusEnvironmentReinfService;
  let httpMock: HttpTestingController;
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StatusEnvironmentReinfService,
        { provide: HttpService, useClass: MockStatusEnvironmentReinfService },
      ]
    });

    service = TestBed.inject(StatusEnvironmentReinfService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    sessionStorage.removeItem('TAFCompany');
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar o status do ambiente em produção', async () => {
    const specRequest = { companyId: 'T1|D MG 01' };

    //service.getCertificateValidity(params);
    await service.getStatusEnvironmentReinf(specRequest).toPromise().then(
      response => {
        const specResponse = response;
        expect(specResponse).toEqual({
          statusEnvironment: 'production',
          layoutReinf: '1_05_10',
          entidadeTSS: '000001',
          versionTSS: ''
        });
      }
    );
  });

});

export class MockStatusEnvironmentReinfService {
  public dummyResponse: StatusEnvironmentResponse;

  get(url: string): any {
    if (url === '/wstaf003/statusEnvironment') {
      this.dummyResponse = {
        statusEnvironment: 'production',
        layoutReinf: '1_05_10',
        entidadeTSS: '000001',
        versionTSS:''
      };
    }
    return of(this.dummyResponse);
  }
}
