import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpService } from 'core/services/http.service';
import { getBranchLoggedIn, getBranchCodeLoggedIn } from '../../../../../util/util';
import { TsiTableService } from './tsi-table.service';
import { MockTsiService } from '../tsi-monitor.service.spec';
import { TsiIntegrationErrorsResponse } from './../../models/tsi-integrations-errors-response';
import { TsiIntegrationErrorsRequest } from './../../models/tsi-integrations-errors-request';

xdescribe('TsiTableService', () => {
  let service: TsiTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpService, useClass: MockTsiService }],
    });
    service = TestBed.inject(TsiTableService);
  });

  it('deve criar o serviço do tsi-table', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a requisição', async () => {
    const mockResponse:TsiIntegrationErrorsResponse = {
      hasNext: false,
      remainingRecords: 0,
      items: [
       {
        layouterror: "C20 - Notas fiscais",
        branchcode: "D MG 01 ",
        integrationtime: "15:50:45",
        errormessage: "Não foi encontrado o conteúdo \r\n 'CCT100101'  informado no sistema de origem correspondente ao campo 'Id.Participante'( C20_CODPAR ) do TAF.",
        integrationdate: "2022-05-25",
        regkey: "",
        codeParticipant: "FAT001-01",
        erpkey: "Operação = NF Saída\r\nNota Fiscal = 000000092\r\nSérie = FAT\r\nData da Nota = 16/05/2022\r\nCód. Participante = FAT001-01",
        invoice: "000000092",
        typeInvoice: "NF Saída",
        serie: "FAT",
        dateInvoice: "16/05/2022"
       }
      ]
    };

    const params: TsiIntegrationErrorsRequest = {
      companyId: getBranchLoggedIn(),
      branchCode: getBranchCodeLoggedIn(),
      dateOf: '2022-04-22',
      dateUp: '2022-04-22',
      typeFilter: 'Todos',
      page: 1,
      pageSize: 10
    };
    const specResponse = await service.getTsiErrors(params).toPromise();
    expect(specResponse).toEqual(mockResponse);
  });
});
