import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { InssReportSyntheticTableComponent } from './inss-report-synthetic-table.component';

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

describe(InssReportSyntheticTableComponent.name, () => {
  let component: InssReportSyntheticTableComponent;
  let fixture: ComponentFixture<InssReportSyntheticTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PoI18nModule.config(i18nConfig)
      ],
      declarations: [
        InssReportSyntheticTableComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InssReportSyntheticTableComponent);
    component = fixture.componentInstance;
    component.taffull = true;
    fixture.detectChanges();
  }));

  it(`deve criar o componente ${InssReportSyntheticTableComponent.name}`, () => {
    expect(component).toBeTruthy();
  });
});

