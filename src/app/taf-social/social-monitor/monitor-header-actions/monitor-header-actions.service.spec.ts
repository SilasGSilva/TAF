import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EsocialMonitorTransmissionRequest } from './../social-monitor-models/EsocialMonitorTransmissionRequest';
import { EsocialMonitorTransmissionResponse } from './../social-monitor-models/EsocialMonitorTransmissionResponse';
import { HttpService } from 'core/services/http.service';
import { MonitorHeaderActionsService } from './monitor-header-actions.service';

xdescribe(MonitorHeaderActionsService.name, () => {
  const esocialContext: string = 'esocial';
  const mockTAFFull: boolean = true;
  let service: MonitorHeaderActionsService;

  class MockHttpService {
    post(url: string): any {
      const dummyResponse = {
        id: '575f53f2-4633-4d67-b664-9ea08e6b099c',
        success: true,
      };

      return of(dummyResponse);
    }
  }

  beforeEach(() => {
    sessionStorage.setItem('TAFFull', JSON.stringify(mockTAFFull));

    TestBed.configureTestingModule({
      providers: [
        MonitorHeaderActionsService,
        { provide: HttpService, useClass: MockHttpService },
      ]
    });

    service = TestBed.inject(MonitorHeaderActionsService);
  });

  it('deve criar o serviço de transmissão do monitor eSocial', () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o POST da API e retornar os dados corretamente com o contexto esocial', async () => {
    const mockRequest: EsocialMonitorTransmissionRequest = {
      branches: ['D MG 01', 'D MG 02'],
      events: ['S-1000'],
      companyId: 'T1|D MG 01 ',
      period: '2019/04',
      keys: [],
      user: '00000',
      sendRejected: false
    };
    const mockPostResponse: EsocialMonitorTransmissionResponse = {
      id: '575f53f2-4633-4d67-b664-9ea08e6b099c',
      success: true,
    };
    const isTAFFull: boolean = JSON.parse(sessionStorage.getItem('TAFFull'));

    const specResponse = await service
      .startTransmission(mockRequest, esocialContext, isTAFFull)
      .toPromise();
    expect(specResponse).toEqual(mockPostResponse);
  });

  it('deve realizar o POST da API e retornar os dados corretamente com o contexto gpe', async () => {
    const mockRequest: EsocialMonitorTransmissionRequest = {
      branches: ['D MG 01', 'D MG 02'],
      events: ['S-1000'],
      companyId: 'T1|D MG 01 ',
      period: '2019/04',
      keys: [],
      user: '00000',
      sendRejected: false
    };
    const mockPostResponse: EsocialMonitorTransmissionResponse = {
      id: '575f53f2-4633-4d67-b664-9ea08e6b099c',
      success: true,
    };
    const isTAFFull: boolean = JSON.parse(sessionStorage.getItem('TAFFull'));

    const specResponse = await service
      .startTransmission(mockRequest, esocialContext, isTAFFull)
      .toPromise();
    expect(specResponse).toEqual(mockPostResponse);
  });
});
