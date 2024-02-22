import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from 'core/services/http.service';
import { LiteralService } from 'core/i18n/literal.service';
import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';
import { ValidationComponent } from './validation.component';
import { EventDescriptionService } from 'shared/event-description/event-description.service';
import { MockStatusEnvironmentReinfService } from '../status-environment-reinf/status-environment-reinf.service.spec';

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

xdescribe('ValidationComponent', () => {
  let component: ValidationComponent;
  let fixture: ComponentFixture<ValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TafFiscalModule, RouterTestingModule],
      providers: [LiteralService,
        EventDescriptionService,
        { provide: HttpService, useClass: MockStatusEnvironmentReinfService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  xit('deve ser criado', async() => {
    component.validationPendingTableComponent.event ='R-2010'
    expect(component).toBeTruthy();
  });

});
