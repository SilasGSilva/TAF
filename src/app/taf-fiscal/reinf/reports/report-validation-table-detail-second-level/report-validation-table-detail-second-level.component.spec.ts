import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { LiteralService } from 'core/i18n/literal.service';
import {
  PoI18nConfig,
  PoI18nModule,
  PoI18nPipe,
} from '@po-ui/ng-components';
import { ReportValidationTableDetailSecondLevelModule } from './report-validation-table-detail-second-level.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { tafFiscalPt } from '../../../../core/i18n/taf-fiscal-pt';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { ReportValidationTableDetailSecondLevelComponent } from './report-validation-table-detail-second-level.component';
import { TableDetailsSecondLevelService } from './../../../../shared/table/table-details-second-level/table-details-second-level.service';

xdescribe('ReportValidationTableDetailSecondLevelComponent', () => {
  let component: ReportValidationTableDetailSecondLevelComponent;
  let fixture: ComponentFixture<
    ReportValidationTableDetailSecondLevelComponent
  >;
  let injector: TestBed;

  const i18nConfig: PoI18nConfig = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: true,
    },
    contexts: {
      tafFiscal: {
        'pt-BR': tafFiscalPt,
      },
    },
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReportValidationTableDetailSecondLevelModule,
        HttpClientTestingModule,
        PoI18nModule.config(i18nConfig),
        RouterTestingModule,
      ],
      providers: [LiteralService, PoI18nPipe, MasksPipe,TableDetailsSecondLevelService],
    }).compileComponents();
    injector = getTestBed();
  }));

  beforeEach(() => {
    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      productLine: 'Protheus',
      tafVersion: 'vTAFA552-1.0.26'
    };

    const config = JSON.stringify(ERPAPPCONFIG);
    sessionStorage.setItem('ERPAPPCONFIG', config);
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    fixture = TestBed.createComponent(
      ReportValidationTableDetailSecondLevelComponent
    );
    component = fixture.componentInstance;
    component.event = 'R-2050';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deve executar a função reportDetailsSecond usando o evento R-2030', () => {
    const columns = component.reportDetailsSecond('R-2030');

    fixture.detectChanges();

    expect(columns.length).toEqual(10);
  });

  it('Deve executar a função reportDetailsSecond usando o evento R-2040', () => {
    const columns = component.reportDetailsSecond('R-2040');

    fixture.detectChanges();

    expect(columns.length).toEqual(10);
  });

  it('Deve executar a função reportDetailsSecond usando o evento em branco', () => {
    const columns = component.reportDetailsSecond('');

    fixture.detectChanges();

    expect(columns.length).toEqual(0);
  });

  it('Deve executar a função setDetailsItems', () => {
    const mockRequest = [
      {
        aliquot: 1000,
        taxBase: 1000,
        value: 1000,
        taxDescription: 'GILRAT',
        registrationNumber: '',
        recipeCode: '',

      },
    ];
    component.setDetailsItems(mockRequest);
    fixture.detectChanges();

    expect(component.tableDetailsSecondItems.length).toEqual(1);
  });
});
