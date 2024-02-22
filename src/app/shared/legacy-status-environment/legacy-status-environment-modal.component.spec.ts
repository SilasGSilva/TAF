import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule, PoI18nPipe, PoInfoModule, PoModalModule, PoTagModule, PoWidgetModule } from '@po-ui/ng-components';
import { LiteralService } from '../../core/i18n/literal.service';
import { tafSocialPt } from '../../core/i18n/taf-social-pt';
import { LegacyStatusEnvironmentModalComponent } from './legacy-status-environment-modal.component';
import { LegacyStatusEnvironmentSocialService } from './services/legacy-status-environment.service';

xdescribe('LegacyStatusEnvironmentModalComponent', () => {
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

  let component: LegacyStatusEnvironmentModalComponent;
  let fixture: ComponentFixture<LegacyStatusEnvironmentModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          PoI18nModule.config(i18nConfig),
          PoModalModule,
          PoInfoModule,
          PoTagModule,
          PoWidgetModule
        ],
        declarations: [LegacyStatusEnvironmentModalComponent],
        providers: [
          LegacyStatusEnvironmentSocialService,
          LiteralService,
          PoI18nPipe,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LegacyStatusEnvironmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
