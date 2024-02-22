import { SafeUrlPdf } from './safe-url-pdf.pipe';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { PoI18nConfig, PoI18nModule, PoI18nPipe, PoModalModule, PoButtonModule, PoDropdownModule } from '@po-ui/ng-components';
import { CatPrintReportService } from './services/cat-print-report.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CatServices } from './../cat-filter/services/cat.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatReportComponent } from './cat-report.component';
import { DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

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

xdescribe(CatReportComponent.name, () => {
  let component: CatReportComponent;
  let fixture: ComponentFixture<CatReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CatReportComponent,
        SafeUrlPdf
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        PoI18nModule.config(i18nConfig),
        PoModalModule,
        PoButtonModule,
        PoDropdownModule
      ],
      providers: [
        PoI18nPipe,
        DatePipe,
        CatServices,
        CatPrintReportService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`deve criar o componente ${CatReportComponent.name}`, () => {
    expect(component).toBeTruthy();
  });
});
