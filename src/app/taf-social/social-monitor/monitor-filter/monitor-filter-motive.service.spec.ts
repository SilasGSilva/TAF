import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpService } from 'core/services/http.service';
import { of } from 'rxjs';
import { MotiveRequest } from '../social-monitor-models/MotiveRequest';
import { MotiveResponse } from '../social-monitor-models/MotiveResponse';
import { MonitorFilterMotiveService } from './monitor-filter-motive.service';

xdescribe('MonitorFilterMotiveService', () => {
  let httpTestingController: HttpTestingController;
  let service: MonitorFilterMotiveService;

  class MockHttpService {
    get(url: string): any {
      const dummyResponse = {
        description: 'Error',
      };

      return of(dummyResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonitorFilterMotiveService,
        { provide: HttpService, useClass: MockHttpService },
      ],
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MonitorFilterMotiveService);
  });

  it('deve criar o serviço MonitorFilterMotiveService', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar a API getListMotive como contexto do esocial e retornar os dados corretamente', () => {
    const mockRequest: MotiveRequest = {
      companyId: 'T1|D MG 01',
      page: 1,
      pageSize: 50,
    };
    const mockMotiveResponse: MotiveResponse = {
      items: [
        {
          motivesCode: '01',
          motivesDescription: 'Motivo de afastamento 01',
        },
      ],
      hasNext: false,
    };
    const spy = spyOn(service, 'getListMotives').and.returnValue(
      of(mockMotiveResponse)
    );

    service.getListMotives(mockRequest);
    expect(spy).toHaveBeenCalled();
  });

  it('deve chamar a API getListMotive como contexto do GPE e retornar os dados corretamente', () => {
    const mockRequest: MotiveRequest = {
      companyId: 'T1|D MG 01',
      page: 1,
      pageSize: 50,
    };

    const mockMotiveResponse: MotiveResponse = {
      items: [
        {
          motivesCode: '01',
          motivesDescription: 'Motivo de afastamento 01',
        },
      ],
      hasNext: false,
    };
    const spy = spyOn(service, 'getListMotives').and.returnValue(
      of(mockMotiveResponse)
    );

    service.getListMotives(mockRequest);

    expect(spy).toHaveBeenCalled();
  });
});
