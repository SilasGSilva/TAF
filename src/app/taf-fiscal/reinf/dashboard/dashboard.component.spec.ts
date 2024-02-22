import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LiteralService } from './../../../core/i18n/literal.service';
import { HttpService } from './../../../core/services/http.service';
import { MockCertificateValidityService } from 'shared/certificate-validity/certificate-validity.service.spec';
import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';
import { CertificateValidityService } from './../../../shared/certificate-validity/certificate-validity.service';
import { DashboardComponent } from './dashboard.component';

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
    productLine: 'Protheus',
  };

  const config = JSON.stringify(ERPAPPCONFIG);

  const statusEnvironment = {
    statusEnvironment: 'production',
    layoutReinf: '1_05_10',
    entidadeTSS: '000001'
  };

  sessionStorage.setItem('TAFCompany', company);
  sessionStorage.setItem('ERPAPPCONFIG', config);
  sessionStorage.setItem(
    'statusEnvironment',
    JSON.stringify(statusEnvironment)
  );
});

xdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let certificateValidity: CertificateValidityService = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TafFiscalModule, RouterTestingModule],
      providers: [LiteralService,
        CertificateValidityService,
        { provide: HttpService, useClass: MockCertificateValidityService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    certificateValidity = TestBed.inject(CertificateValidityService);
    fixture.detectChanges();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('deve ser criado', async () => {
    expect(component).toBeTruthy();
  });

  it('deve executar a função getEventsReinfTotalizer', async () => {
    const spyGetReport = spyOn(component, 'getEventsReinfTotalizer');

    component.getEventsReinfTotalizer();
    expect(spyGetReport).toHaveBeenCalledTimes(1);
  });
});
