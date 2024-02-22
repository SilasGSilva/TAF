import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';
import { tafFiscalPt } from 'core/i18n/taf-fiscal-pt';
import { HttpService } from 'core/services/http.service';

import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';
import { TsiDivergentDocumentsTableComponent } from './tsi-divergent-documents-table.component';
import { MockTsiService } from '../../monitor/tsi-monitor.service.spec';

const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: false,
  },
  contexts: {
    tafFiscal: {
      'pt-BR': tafFiscalPt,
    },
  },
};

xdescribe('TsiDivergentDocumentsTableComponent', () => {
  let component: TsiDivergentDocumentsTableComponent;
  let fixture: ComponentFixture<TsiDivergentDocumentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TsiDivergentDocumentsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(async() => {
    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      productLine: 'Protheus',
      tafVersion: 'vTAFA552-1.0.26'
    };
    const config = JSON.stringify(ERPAPPCONFIG);
    sessionStorage.setItem('ERPAPPCONFIG', config);

    await TestBed.configureTestingModule({
      imports: [TafFiscalModule,RouterTestingModule,PoI18nModule.config(i18nConfig)],
      declarations: [TsiDivergentDocumentsTableComponent],
      providers: [ LiteralService,
        TsiDivergentDocumentsTableComponent,
        { provide: HttpService, useClass: MockTsiService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TsiDivergentDocumentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
