import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { InssReportCardSyntheticDashboardComponent } from './inss-report-card-synthetic-dashboard.component';

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

describe(InssReportCardSyntheticDashboardComponent.name, () => {
  let component: InssReportCardSyntheticDashboardComponent;
  let fixture: ComponentFixture<InssReportCardSyntheticDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PoI18nModule.config(i18nConfig)
      ],
      declarations: [
        InssReportCardSyntheticDashboardComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InssReportCardSyntheticDashboardComponent);
    component = fixture.componentInstance;
  }));

  it(`deve criar o componente ${InssReportCardSyntheticDashboardComponent.name}`, () => {
    expect(component).toBeTruthy();
  });
});
