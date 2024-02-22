import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpService } from 'core/services/http.service';
import { MockTsiService } from '../../monitor/tsi-monitor.service.spec';
import { TsiDivergentDocumentsTableService } from './tsi-divergent-documents-table.service';
import { TsiDivergentDocumentsRequest } from './../../models/tsi-divergent-documents-request';
import { TsiDivergentDocumentsResponse } from './../../models/tsi-divergent-documents-response';

xdescribe('TsiDivergentDocumentsTableService', () => {
  let service: TsiDivergentDocumentsTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpService, useClass: MockTsiService }],
    });
    service = TestBed.inject(TsiDivergentDocumentsTableService);
  });

  it('deve criar o serviço do tsi-divergent-document-table', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a requisição', async () => {
    const mockResponse:TsiDivergentDocumentsResponse =
    {
      hasNext: false,
      remainingRecords: 0,
      items: [
        {
          branchcode: "D MG 01 ",
          notefoundinsft: "S",
          notefoundintaf: "N",
          integrationerrorinv5r: "S",
          typingdate: "2022-05-25",
          operationtype: "entrada",
          documentnumber: "000000001",
          series: "001",
          participantcodeandname: "FAT00101 Cliente Fat",
          participantscnpj: "10233269000252",
          cancelederp: "N",
          canceledtaf: "N",
          stampc20: "2022-05-25 11:57:52.210",
          stampsft: "2022-05-25 11:57:52.210",
          participantcode: 'FAT001',
          store: '01',
          recnov5r: 1,
          details: "Não foi encontrado o conteúdo 'FAT00101' informado no sistema de origem, esse conteúdo corresponde ao campo 'Id. Participante' ( C20_CODPAR ) do TAF.",
        }
      ]
    };
    const params: TsiDivergentDocumentsRequest = {
      companyId: 'T1|D MG 01 ',
      branchCode: 'D MG 01 ',
      dateOf: '2022-04-22',
      dateUp: '2022-04-22',
      page: 1,
      pageSize: 10
    };
    const specResponse = await service.getTsiDivergentDocuments(params).toPromise();
    expect(specResponse).toEqual(mockResponse);
  });
});
