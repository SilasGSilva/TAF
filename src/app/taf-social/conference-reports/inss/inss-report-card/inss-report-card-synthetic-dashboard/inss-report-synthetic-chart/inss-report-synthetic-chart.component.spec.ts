import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { InssReportSyntheticChartComponent } from './inss-report-synthetic-chart.component';

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

describe(InssReportSyntheticChartComponent.name, () => {
  let component: InssReportSyntheticChartComponent;
  let fixture: ComponentFixture<InssReportSyntheticChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PoI18nModule.config(i18nConfig)
      ],
      declarations: [
        InssReportSyntheticChartComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InssReportSyntheticChartComponent);
    component = fixture.componentInstance;
  }));

  it(`deve criar o componente ${InssReportSyntheticChartComponent.name}`, () => {
    expect(component).toBeTruthy();
  });
});
