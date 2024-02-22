import { TestBed } from '@angular/core/testing';

import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';

import { LiteralService } from 'core/i18n/literal.service';
import { CoreModule } from 'core/core.module';
import { SocialMonitorService } from './social-monitor.service';

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

  sessionStorage.setItem('TAFCompany', company);
  sessionStorage.setItem('ERPAPPCONFIG', config);
});

xdescribe('SocialMonitorService', () => {
  let httpTestingController: HttpTestingController;
  let service: SocialMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialMonitorService, LiteralService],
      imports: [HttpClientTestingModule, CoreModule],
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SocialMonitorService);
  });

  it('deve criar o serviço social-monitor', () => {
    expect(service).toBeTruthy();
  });

  it('deve verificar se os método updateMonitor e returnStateMonitor foram executados corretamente', () => {
    service.updateMonitor(true);
    expect(service.returnStateMonitor()).toBeTruthy();
  });

  it('deve verificar se o método getCompanyCode foi executado corretamente', () => {
    expect(service.getCompanyCode()).toEqual('T1');
  });

  it('deve verificar se o método getCompanyCode retorna vazio quando a linha de produto for Datasul', () => {
    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      version: '12.23.0',
      serverBackend: '/',
      restEntryPoint: 'rest',
      versionAPI: '',
      appVersion: '0.1.6',
      productLine: 'Datasul'
    };

    const config = JSON.stringify(ERPAPPCONFIG);
    sessionStorage.removeItem('ERPAPPCONFIG');
    sessionStorage.setItem('ERPAPPCONFIG', config);
    expect(service.getCompanyCode()).toEqual('');
  });

  it('deve verificar se o método getCompany foi executado corretamente', () => {
    expect(service.getCompany()).toEqual('T1|D MG 01');
  });
});

afterEach(() => {
  sessionStorage.removeItem('TAFCompany');
  sessionStorage.removeItem('ERPAPPCONFIG');
});
