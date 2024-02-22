import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule, PoNotificationService } from '@po-ui/ng-components';
import { HttpService } from '../../../../core/services/http.service';
import { LiteralService } from 'core/i18n/literal.service';
import { sharedPt } from '../../../../core/i18n/shared-pt';
import { TafFiscalModule } from './../../../taf-fiscal.module';
import { StatusEnvironmentReinfComponent } from './status-environment-reinf.component';
import { MockStatusEnvironmentReinfService } from './status-environment-reinf.service.spec';



const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: false,
  },
  contexts: {
    sharedPt: {
      'pt-BR': sharedPt,
    },
  },
};

xdescribe('StatusEnvironmentReinfComponent', () => {
  let component: StatusEnvironmentReinfComponent;
  let fixture: ComponentFixture<StatusEnvironmentReinfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoI18nModule.config(i18nConfig),TafFiscalModule],
      declarations: [StatusEnvironmentReinfComponent],
      providers: [ LiteralService,
        { provide: HttpService, useClass: MockStatusEnvironmentReinfService },
        PoNotificationService],
    }).compileComponents();

    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01'
    };

    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);
    sessionStorage.setItem('TAFFull', JSON.stringify(true));

    fixture = TestBed.createComponent(StatusEnvironmentReinfComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
