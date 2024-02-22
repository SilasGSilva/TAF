
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpService } from './../../../../../core/services/http.service';
import { MockTsiService } from '../../../monitor/tsi-monitor.service.spec';
import { TsiLastStampService } from './tsi-last-stamp.service';
import { TsiLastStampRequest } from './../../../models/tsi-last-stamp-request';
import { TsiLastStampResponse } from './../../../models/tsi-last-stamp-response';
import { TsiAtuStampResponse } from '../../../models/tsi-atu-stamp-response';
import { TsiAtuStampRequest } from '../../../models/tsi-atu-stamp-request';

xdescribe('TsiLastStampService', () => {
  let service: TsiLastStampService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpService, useClass: MockTsiService }],
    });
    service = TestBed.inject(TsiLastStampService);
  });

  it('deve criar o serviço do tsi-last-stamp', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a requisição de ultimo stamp', async () => {
    const mockLastStamp: TsiLastStampResponse = {
      alias: 'C20',
      stamp: '2022-07-20 20:31:56.583',
      branchCode: 'D MG 01 '
    };
    const params: TsiLastStampRequest = {
      companyId: 'T1|D MG 01',
      alias: "C20",
      branchCode: 'D MG 01'
    };
    const specResponse = await service.getLastStamp(params).toPromise();
    expect(specResponse).toEqual(mockLastStamp);
  });

  it('deve retornar a requisição de atualização de stamp', async () => {
    const mockLastStamp: TsiAtuStampResponse = {
      sucess: true,
      message: 'Stamp atualizado com sucesso na tabela V80 para o alias C20'
    };
    const params: TsiAtuStampRequest = {
      companyId: 'T1|D MG 01',
      alias: "C20",
      branchCode: 'D MG 01',
      dateStamp: '2022-07-22'
    };
    const specResponse = await service.postAtuStamp(params).toPromise();
    expect(specResponse).toEqual(mockLastStamp);
  });

});
