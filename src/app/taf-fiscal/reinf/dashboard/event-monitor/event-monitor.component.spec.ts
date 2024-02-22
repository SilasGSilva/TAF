import { ComponentFixture, TestBed, fakeAsync, getTestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
  APP_BASE_HREF,
} from '@angular/common';
import { of } from 'rxjs';

import {
  PoTagModule,
  PoPageModule,
  PoTableModule,
  PoButtonModule,
  PoLoadingModule,
  PoContainerModule,
  PoI18nConfig,
  PoI18nModule
} from '@po-ui/ng-components';

import { SharedModule } from 'shared/shared.module';
import { EventStatusCardListModule } from 'shared/card/events/event-status-card-list/event-status-card-list.module';
import { ButtonBackModule } from 'shared/button-back/button-back.module';
import { EventDescriptionService } from 'shared/event-description/event-description.service';
import { EventMonitorComponent } from './event-monitor.component';
import { EventMonitorTableModule } from './event-monitor-table/event-monitor-table.module';
import { tafFiscalPt } from 'core/i18n/taf-fiscal-pt';

xdescribe('EventMonitorComponent', () => {
  let component: EventMonitorComponent;
  let fixture: ComponentFixture<EventMonitorComponent>;
  let eventDescriptionService: EventDescriptionService;
  let injector: TestBed;
  let mockActiveRoute;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  const i18nConfig: PoI18nConfig = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: true,
    },
    contexts: {
      tafFiscal: {
        'pt-BR': tafFiscalPt,
      },
    },
  };

  beforeEach(fakeAsync(() => {
    mockActiveRoute = {
      snapshot: {
        queryParams: {
          event: 'R-1000',
        },
      },
    };

    TestBed.configureTestingModule({
      declarations: [ EventMonitorComponent ],
      imports: [
        SharedModule,
        PoTagModule,
        PoPageModule,
        PoTableModule,
        PoButtonModule,
        PoLoadingModule,
        PoContainerModule,
        ButtonBackModule,
        EventMonitorTableModule,
        EventStatusCardListModule,
        PoI18nModule.config(i18nConfig),
      ],
      providers: [
        Location,
        EventDescriptionService,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: ActivatedRoute, useFactory: () => mockActiveRoute },
        { provide: Router, useValue: mockRouter },
        { provide: APP_BASE_HREF, useValue: '/my/app' },
      ]
    })
    .compileComponents();
    injector = getTestBed();
    eventDescriptionService = injector.get(EventDescriptionService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  xit('deve retornar a descrição do evento informado', () => {
    const mockDescriptionR1000 = {
      description: 'Informações do contribuinte'
    };

    spyOn(eventDescriptionService, 'getDescription')
    .and.returnValue(of(mockDescriptionR1000));

    component.getDescription({eventDesc: 'R-1000'});

    fixture.detectChanges();

    expect(component.description).toBe(mockDescriptionR1000.description);
  });
});
