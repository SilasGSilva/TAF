import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { IrrfReportParamsStoreService } from '../../services/stores/irrf/irrf-report-params-store/irrf-report-params-store.service';
import { IrrfReportCardSyntheticDashboardComponent } from './irrf-report-card-synthetic-dashboard.component';

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

describe(IrrfReportCardSyntheticDashboardComponent.name, () => {
  let component: IrrfReportCardSyntheticDashboardComponent;
  let fixture: ComponentFixture<IrrfReportCardSyntheticDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoI18nModule.config(i18nConfig)],
      declarations: [IrrfReportCardSyntheticDashboardComponent],
      providers: [IrrfReportParamsStoreService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrrfReportCardSyntheticDashboardComponent);
    component = fixture.componentInstance;
  });

  it(`deve criar o serviço ${IrrfReportCardSyntheticDashboardComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it(`deve exibir 2 Cards quando for ambiente sem necessidade Legacy (V5H) e 3 Cards quando for ambiente TAFFull true e Legacy (V5H) true corretamente`, () => {
    let cardAmounts: number;

    component.isConfiguredService = false;
    component.isTAFFull = true;
    fixture.detectChanges();

    cardAmounts= fixture.nativeElement.querySelectorAll('app-irrf-report-card').length;

    expect(cardAmounts)
      .withContext('deve exibir apenas 2 Cards com propriedades TAFFull false ou isConfiguredService false')
      .toBe(2);

    component.isConfiguredService = true;
    component.isTAFFull = true;
    fixture.detectChanges();
    cardAmounts = fixture.nativeElement.querySelectorAll('app-irrf-report-card').length;

    expect(cardAmounts)
      .withContext('deve exibir 3 Cards com propriedades TAFFull true e isConfiguredService true')
      .toBe(3);
  });
});
