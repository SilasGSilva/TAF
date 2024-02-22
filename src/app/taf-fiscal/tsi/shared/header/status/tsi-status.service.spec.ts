import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpService } from '../../../../../core/services/http.service';
import { TsiStatusService } from './tsi-status.service';
import { MockTsiService } from '../../../monitor/tsi-monitor.service.spec';
import { TsiStatusRequest } from './../../../models/tsi-status-request';

xdescribe('TsiStatusService', () => {
  let service: TsiStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpService, useClass: MockTsiService }],
    });
    service = TestBed.inject(TsiStatusService);
  });

  it('deve criar o serviço do tsi-status', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a requisição', async () => {
    const mockResponse = {
      status:
      {
        configuredService: true,
        activeService: false
      }
    };
    const params: TsiStatusRequest = {
      companyId: 'T1|D MG 01',
    };
    const specResponse = await service.getTsiStatus(params).toPromise();
    expect(specResponse).toEqual(mockResponse);
  });
});
