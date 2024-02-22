import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoWidgetModule, PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';

import { MonitorTotalizerCardsComponent } from './monitor-totalizer-cards.component';
import { tafSocialPt } from 'core/i18n/taf-social-pt';

xdescribe('MonitorTotalizerCardsComponent', () => {
  let component: MonitorTotalizerCardsComponent;
  let fixture: ComponentFixture<MonitorTotalizerCardsComponent>;

  const i18nConfig: PoI18nConfig = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: true
    },
    contexts: {
      tafSocial: {
        'pt-BR': tafSocialPt
      },
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorTotalizerCardsComponent ],
      imports: [
        PoWidgetModule,
        PoI18nModule.config(i18nConfig)
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorTotalizerCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });
});
