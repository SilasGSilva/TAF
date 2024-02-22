import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpService } from 'core/services/http.service';
import { TsiDivergentDocumentsReinstateRequest } from './../models/tsi-divergent-documents-reinstate-request';
import { TsiDivergentDocumentsService } from './tsi-divergent-documents.service';
import { TsiDivergentDocumentsReinstateResponse } from './../models/tsi-divergent-documents-reinstate-response';
import { TsiDivergentDocumentsBody } from '../models/tsi-divergent-documents-body';
import { MockTsiService } from '../monitor/tsi-monitor.service.spec';


xdescribe('TsiDivergentDocumentsService', () => {
  let service: TsiDivergentDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpService, useClass: MockTsiService }],
    });
    service = TestBed.inject(TsiDivergentDocumentsService);
  });

  it('deve criar o serviço do tsi-divergent-documents.service', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a requisição', async () => {
    const mockResponseReprocess: TsiDivergentDocumentsReinstateResponse = {
      status: true,
      message: 'Documentos reprocessados com sucesso, aguarde o processamento do TSI'
    };
    const params: TsiDivergentDocumentsReinstateRequest = {
      companyId: 'T1|D MG 01',
      branchCode: 'D MG 01',
      dateOf: '2022-01-01',
      dateUp: '2022-12-31'
    };

    const bodyReprocess: TsiDivergentDocumentsBody = {
      reprocessAll: true,
      itemsV5R: [],
      itemsSFT: []
    };
    const bodyJSON = JSON.stringify(bodyReprocess);
    const specResponse = await service.postReinstateInvoices(JSON.stringify(bodyReprocess), params).toPromise();
    expect(specResponse).toEqual(mockResponseReprocess);
  });
});




