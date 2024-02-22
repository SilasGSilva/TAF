import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { InssReportParamsStoreService } from '../../services/stores/inss/inss-report-params-store/inss-report-params-store.service';
import { InssReportCardComponent } from './inss-report-card.component';

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

describe(InssReportCardComponent.name, () => {
  let component: InssReportCardComponent;
  let fixture: ComponentFixture<InssReportCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoI18nModule.config(i18nConfig)],
      declarations: [InssReportCardComponent],
      providers: [InssReportParamsStoreService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InssReportCardComponent);
    component = fixture.componentInstance;
  }));

  it(`deve criar o componente ${InssReportCardComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it(`deve exibir 2 Cards quando for ambiente sem necessidade Legacy (V5H) e 3 Cards quando for ambiente TAFFull true e Legacy (V5H) true corretamente`, () => {
    let cardAmounts: number;

    component.isConfiguredService = false;
    component.isTAFFull = true;
    fixture.detectChanges();

    cardAmounts= fixture.nativeElement.querySelectorAll("po-widget[p-height='160']").length;

    expect(cardAmounts)
      .withContext('deve exibir apenas 2 Cards com propriedades TAFFull false ou isConfiguredService false')
      .toBe(2);

    component.isConfiguredService = true;
    component.isTAFFull = true;
    fixture.detectChanges();
    cardAmounts = fixture.nativeElement.querySelectorAll("po-widget[p-height='160']").length;

    expect(cardAmounts)
      .withContext('deve exibir 3 Cards com propriedades TAFFull true e isConfiguredService true')
      .toBe(3);
  });
});
