import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import {
  PoI18nModule,
  PoI18nConfig,
} from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { MonitorEventsCardsComponent } from './monitor-events-cards.component';

xdescribe(MonitorEventsCardsComponent.name, () => {
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
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };
  const mockInputEvent = {
    eventCode: "S-3000",
    total: 10,
    eventDescription: "Exclusão de Eventos",
    status: [
      {
        title: "Pendente de Envio",
        type: "1",
        value: "3",
        warning: false
      },
      {
        title: "Aguardando Governo",
        type: "2",
        value: "2",
        warning: false
      },
      {
        title: "Rejeitado",
        type: "3",
        value: "1",
        warning: false
      },
      {
        title: "Sucesso",
        type: "4",
        value: "2",
        warning: false
      },
      {
        title: "Excluido",
        type: "5",
        value: "2",
        warning: false
      }
    ]
  }

  let component: MonitorEventsCardsComponent;
  let fixture: ComponentFixture<MonitorEventsCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ PoI18nModule.config(i18nConfig) ],
      declarations: [
        MonitorEventsCardsComponent,
      ],
      providers:  [
        RouterTestingModule,
        {
          provide: Router,
          useValue: mockRouter
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorEventsCardsComponent);
    component = fixture.componentInstance;
    component.event = mockInputEvent;
  }));

  it(`deve criar o componente ${MonitorEventsCardsComponent.name}`, () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`#onChangeSelectedEvents
    deve disparar a Output Property taf-event-selected caso haja eventos selecionados quando checkbox do card for selecionado `, () => {
      const $event: boolean = true;

      component.selectedCard = false;
      component.eventCards = [{
        status: [
          {title: 'Pendente de Envio', type: '1', value: '6', warning: true},
          {title: 'Aguardando Governo', type: '2', value: '0', warning: false},
          {title: 'Rejeitado', type: '3', value: '2', warning: true},
          {title: 'Sucesso', type: '4', value: '0', warning: false},
          {title: 'Excluido', type: '5', value: '0', warning: false},
        ],
        eventCode: 'S-3000',
        total: 8,
        eventDescription: 'Exclusão de Eventos',
        checked: true
      }];

      spyOn(component.eventEmit, 'emit');

      component.onChangeSelectedEvents($event);

      expect(component.eventEmit.emit)
        .withContext('Deve emitir valor true pois o usuário marcou o checkbox do card')
        .toHaveBeenCalledWith(true);
    });
});
