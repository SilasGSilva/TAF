import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MonitorHeaderActionsComponent } from './monitor-header-actions.component';
import {
  PoButtonModule,
  PoModalModule,
  PoI18nModule,
  PoI18nConfig,
  PoDialogService,
} from '@po-ui/ng-components';
import { MonitorHeaderActionsService } from './monitor-header-actions.service';
import { SocialMonitorService } from '../social-monitor.service';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { tafSocialPt } from 'core/i18n/taf-social-pt';

xdescribe('MonitorHeaderActionsComponent', () => {
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

  const mockContext = 'esocial';

  let component: MonitorHeaderActionsComponent;
  let fixture: ComponentFixture<MonitorHeaderActionsComponent>;

  beforeEach(waitForAsync(() => {
    sessionStorage.setItem('TAFContext', JSON.stringify(mockContext));

    TestBed.configureTestingModule({
      imports: [
        PoButtonModule,
        PoModalModule,
        PoI18nModule.config(i18nConfig),
        RouterTestingModule,
      ],
      declarations: [MonitorHeaderActionsComponent, MessengerComponent],
      providers: [
        PoDialogService,
        MonitorHeaderActionsService,
        SocialMonitorService,
      ],
    }).compileComponents();
    const event = new NavigationEnd(
      1,
      '/monitorDetail?event=S-1020&description=Tabela%20de%20Lota%C3%A7%C3%B5es%20Tribut%C3%A1rias&status=&period=&periodFrom=&periodTo=&branches=D%20MG%2001',
      '/'
    );
    TestBed.get(Router).events.next(event);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorHeaderActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve realizar a chamada do evento de transmissão sem título', () => {
    component.messengerModal.onShowMessage('Mensagem', false, false);

    expect(component.messengerModal.title).toEqual(undefined);
  });
  
  it('deve realizar a chamada do evento de transmissão com título', () => {
    component.messengerModal.onShowMessage('Mensagem', false, false, 'Título');

    expect(component.messengerModal.title).toEqual('Título');
  });
});
