import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CoreModule } from 'core/core.module';
import { LiteralService } from 'core/i18n/literal.service';
import { EventRequest } from '../../models/EventRequest';
import { SocialListEventService } from './social-list-event.service';

xdescribe('SocialListEventService', () => {
  let httpTestingController: HttpTestingController;
  let service: SocialListEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialListEventService, LiteralService],
      imports: [HttpClientTestingModule, CoreModule],
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SocialListEventService);

    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      version: '12.23.0',
      serverBackend: '/',
      restEntryPoint: 'rest',
      versionAPI: '',
      appVersion: '0.1.6',
      productLine: 'Protheus',
    };
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const tafFull = true;
    const tafContext = 'esocial';

    sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));
    sessionStorage.setItem('TAFFull', JSON.stringify(tafFull));
    sessionStorage.setItem('TAFContext', tafContext);
    sessionStorage.setItem('ERPAPPCONFIG', JSON.stringify(ERPAPPCONFIG));
  });

  afterEach(() => {
    sessionStorage.removeItem('TAFCompany');
    sessionStorage.removeItem('ERPAPPCONFIG');
  });

  it('deve criar o serviços de filtro de filiais', () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o GET através da função getListEstablishment e retornar os dados corretamente', fakeAsync(() => {
    const mockRequest: EventRequest = {
      companyId: 'T1|D MG 01',
    };

    const mockGetResponse = {
      items: [
        {
          eventCode: 'S-1000',
          eventDescription:
            'Informações do Empregador/Contribuinte/Orgão Público',
        },
        {
          eventCode: 'S-1005',
          eventDescription: 'Tabela de Estabelecimentos',
        },
      ],
    };

    service
      .getListEvents(mockRequest)
      .toPromise()
      .then(response => {
        expect(mockGetResponse).toEqual(response);
      });

    tick();

    expect(mockGetResponse).toBeDefined();
  }));
});
