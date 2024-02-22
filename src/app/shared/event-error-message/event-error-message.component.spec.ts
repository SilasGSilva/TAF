import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import {
  PoLoadingModule,
  PoModalModule,
  PoPageModule,
  PoI18nConfig,
  PoI18nModule,
} from '@po-ui/ng-components';

import { tafFiscalPt } from 'core/i18n/taf-fiscal-pt';
import { EventErrorMessageComponent } from './event-error-message.component';
import { EventErrorMessageService } from './event-error-message.service';

xdescribe('EventErrorMessageComponent', () => {
  let component: EventErrorMessageComponent;
  let fixture: ComponentFixture<EventErrorMessageComponent>;
  let eventErrorMessageService: EventErrorMessageService;
  let injector: TestBed;
  let mockActiveRoute;

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

  beforeEach(waitForAsync(() => {
    mockActiveRoute = {
      snapshot: {
        queryParams: {
          period: '012019',
          event: 'R-1000',
        },
      },
    };

    TestBed.configureTestingModule({
      declarations: [EventErrorMessageComponent],
      imports: [
        PoPageModule,
        PoModalModule,
        PoLoadingModule,
        PoI18nModule.config(i18nConfig),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useFactory: () => mockActiveRoute,
        },
      ],
    }).compileComponents();
    injector = getTestBed();
    eventErrorMessageService = injector.get(EventErrorMessageService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventErrorMessageComponent);
    component = fixture.componentInstance;
    component.buttonMessage = 'Fechar';
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar o detalhe do erro de acordo com o errorId informado', async function() {
    const spyModal = spyOn(component.poModal, 'open');

    component.params = {
      period: '2019',
      event: 'R-2010',
    };

    const mockEventError = {
      companyId: 'T1|D MG 01',
      period: component.params.period,
      event: component.params.event,
      errorId: '00748',
    };

    const mockErrorMessage = {
      errorTransmission: [
        {
          code: 'Erro de Schema',
          tagxml: '<foneFixo>',
          description: `Element {
          http://www.reinf.esocial.gov.br/schemas/evtInfoContribuinte/v1_04_00
        }
          foneFixo': [facet 'minLength'] The value has a length of '0';
          this underruns the allowed minimum length of '1'.
        `,
        },
      ],
    };

    spyOn(eventErrorMessageService, 'getMsgErrorGov')
      .withArgs(mockEventError)
      .and.returnValue(of(mockErrorMessage));

    await component.errorDetail(mockEventError.errorId);

    fixture.detectChanges();

    expect(component.errorList).toBe(mockErrorMessage);
    expect(spyModal).toHaveBeenCalled();
  });

  it('deve retornar o detalhe do erro de acordo com o errorId, period e event informado', async function() {
    const spyModal = spyOn(component.poModal, 'open');

    const mockParams = {
      companyId: 'T1|D MG 01',
      period: '2019',
      event: 'R-2010',
      errorId: '00749',
    };

    const mockErrorMessage = {
      errorTransmission: [
        {
          code: 'Erro de Schema',
          tagxml: '<foneFixo>',
          description: `Element {
          http://www.reinf.esocial.gov.br/schemas/evtInfoContribuinte/v1_04_00
        }
          foneFixo': [facet 'minLength'] The value has a length of '0';
          this underruns the allowed minimum length of '1'.
        `,
        },
      ],
    };

    spyOn(eventErrorMessageService, 'getMsgErrorGov')
      .withArgs(mockParams)
      .and.returnValue(of(mockErrorMessage));

    await component.errorDetail(
      mockParams.errorId,
      mockParams.period,
      mockParams.event
    );

    fixture.detectChanges();

    expect(component.errorList).toBe(mockErrorMessage);
    expect(spyModal).toHaveBeenCalled();
  });
});
