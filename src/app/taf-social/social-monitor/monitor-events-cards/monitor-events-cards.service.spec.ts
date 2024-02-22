import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MonitorEventsCardsService } from './monitor-events-cards.service';

xdescribe('MonitorEventsCardsService', () => {
  let httpTestingController: HttpTestingController;
  let service: MonitorEventsCardsService;

  const mockRequest = {
    companyId: 'T1|D MG 01 ',
    branches: ['D MG 01', 'D MG 02'],
    events: ['S-1000', 'S-1005'],
    period: '2019/04',
  };

  const mockEsocialMonitorHomeCards = {
    items: [
      {
        eventCode: 'S-1010',
        eventDescription: 'Tabela de Rúbricas',
        total: 50,
        status: [
          {
            title: 'Pendente de Envio',
            value: 10,
            type: '1',
            warning: true,
          },
          {
            title: 'Aguardando Governo',
            value: 10,
            type: '2',
            warning: false,
          },
          {
            title: 'Rejeitado',
            type: '3',
            value: 10,
            warning: true,
          },
          {
            title: 'Sucesso',
            type: '4',
            value: 10,
            warning: false,
          },
          {
            title: 'Excluído',
            type: '5',
            value: 10,
            warning: false,
          },
        ],
      },
      {
        eventCode: 'S-2230',
        eventDescription: 'Afastamento Temporário',
        total: 40,
        status: [
          {
            title: 'Pendente de Envio',
            type: '1',
            value: 10,
            warning: true,
          },
          {
            title: 'Aguardando Governo',
            type: '2',
            value: 10,
            warning: false,
          },
          {
            title: 'Rejeitado',
            type: '3',
            value: 10,
            warning: true,
          },
          {
            title: 'Sucesso',
            type: '4',
            value: 10,
            warning: false,
          },
          {
            title: 'Excluído',
            type: '5',
            value: 10,
            warning: false,
          },
        ],
      },
    ],
  };

  const mockTAFFull = true;

  beforeEach(() => {
    sessionStorage.setItem('TAFFull', JSON.stringify(mockTAFFull));

    TestBed.configureTestingModule({
      providers: [MonitorEventsCardsService],
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(MonitorEventsCardsService);
  });

  it('deve criar o serviço monitor-events-cards', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar a API e retornar os dados corretamente para o contexto esocial', () => {
    const isTAFFull: boolean = JSON.parse(sessionStorage.getItem('TAFFull'));
    const menuContext = 'esocial';

    service
      .getEventsCards(mockRequest, menuContext, isTAFFull)
      .subscribe(cardsData => {
        expect(cardsData.items[0].eventCode).toEqual('S-1010');
      });

    const requestURL = isTAFFull
      ? '/api/rh/esocial/v1/TAFEsocialMonitorHomeCards'
      : '/api/rh/esocial/v1/EsocialMonitorHomeCards';

    const req = httpTestingController.expectOne(requestURL);

    expect(req.request.method).toEqual('POST');

    req.flush(mockEsocialMonitorHomeCards);

    httpTestingController.verify();
  });

  it('deve chamar a API e retornar os dados corretamente para o contexto gpe', () => {
    const isTAFFull: boolean = JSON.parse(sessionStorage.getItem('TAFFull'));
    const menuContext = 'gpe';

    service
      .getEventsCards(mockRequest, menuContext, isTAFFull)
      .subscribe(cardsData => {
        expect(cardsData.items[0].eventCode).toEqual('S-1010');
      });

    const req = httpTestingController.expectOne(
      '/api/rh/esocial/v1/GPEEsocialMonitorHomeCards'
    );

    expect(req.request.method).toEqual('POST');

    req.flush(mockEsocialMonitorHomeCards);

    httpTestingController.verify();
  });
});
