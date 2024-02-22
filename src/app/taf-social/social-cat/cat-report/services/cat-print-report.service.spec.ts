import { DatePipe } from '@angular/common';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { PoI18nModule, PoI18nConfig, PoI18nPipe } from '@po-ui/ng-components';
import { TestBed } from '@angular/core/testing';
import { CatPrintReportService } from './cat-print-report.service';

const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: true,
  },
  contexts: {
    tafSocial: {
      'pt-BR': tafSocialPt,
    },
  },
};

xdescribe(CatPrintReportService.name, () => {
  let service: CatPrintReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PoI18nModule.config(i18nConfig)
      ],
      providers: [
        PoI18nPipe,
        DatePipe,
        CatPrintReportService
      ]
    });
    service = TestBed.inject(CatPrintReportService);
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it(`deve criar o serviço ${CatPrintReportService.name}`, () => {
    expect(service).toBeTruthy();
  });
});
