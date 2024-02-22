import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { tafSocialPt } from '../../../core/i18n/taf-social-pt';
import { MonitorStatusEnvironmentComponent } from './monitor-status-environment.component';
import { SocialStatusEnvironmentService } from './../../services/social-status-environment/social-status-environment.service';

xdescribe('MonitorStatusEnvironmentComponent', () => {
  let component: MonitorStatusEnvironmentComponent;
  let fixture: ComponentFixture<MonitorStatusEnvironmentComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitorStatusEnvironmentComponent],
      imports: [PoI18nModule.config(i18nConfig)],
      providers: [SocialStatusEnvironmentService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorStatusEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
