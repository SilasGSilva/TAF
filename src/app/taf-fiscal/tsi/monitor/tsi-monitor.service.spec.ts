import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from "rxjs";
import { HttpService } from 'core/services/http.service';
import { TsiReprocessRequest } from './../models/tsi-reprocess-request';
import { TsiMonitorService } from './tsi-monitor.service';
import { TsiReprocessResponse } from './../models/tsi-reprocess-response';
import { TsiDivergentDocumentsResponse } from '../models/tsi-divergent-documents-response';
import { TsiReprocessBody } from '../models/tsi-reprocess-body';
import { TsiAtuStampResponse } from '../models/tsi-atu-stamp-response';
import { TsiDivergentDocumentsReinstateResponse } from './../models/tsi-divergent-documents-reinstate-response';
import { TsiLastStampResponse } from './../models/tsi-last-stamp-response';

export class MockTsiService {
  get(url: string) {
    let mockResponse;
    if (url === '/api/tsi/v1/TsiBranches') {
      mockResponse = {
        branches: [
          {
            branchCode: "Todas",
            branchDescription: "Todas"
          },
          {
            branchCode: "D MG 01 ",
            branchDescription: "Filial BELO HOR"
          }
        ]
      };
      return of(mockResponse);

    } else if (url === '/api/tsi/v1/TSIServiceStatus') {
      mockResponse = {
        status:
        {
          configuredService: true,
          activeService: false
        }
      };
      return of(mockResponse);

    } else if (url === '/api/tsi/v1/TSIIntegrationErrors') {
      mockResponse = {
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
          },
        ]
      };
      return of(mockResponse);

    } else if (url === '/api/tsi/v1/TSIDivergentDocuments') {
      const mockDivergentDocumentsResponse: TsiDivergentDocumentsResponse = {
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
          },
        ]
      };
      return of(mockDivergentDocumentsResponse);
    } else if (url === '/api/tsi/v1/TSIUtilStamp/getLastStamp') {
      const mockLastStamp: TsiLastStampResponse = {
        alias: 'C20',
        stamp: '2022-07-20 20:31:56.583',
        branchCode: 'D MG 01 '
      };
      return of(mockLastStamp);
    }
  }

  post(url: string) {
    if (url === '/api/tsi/v1/TSIIntegrationErrors/reprocessInvoice') {
      const mockResponseReprocess: TsiReprocessResponse = {
        status: true,
        message: 'Notas Fiscais reprocessadas com sucesso, aguarde o processamento do TSI'
      };
      return of(mockResponseReprocess);
    } else if (url === '/api/tsi/v1/TSIDivergentDocuments/reinstate') {
      const mockResponseReinstate: TsiDivergentDocumentsReinstateResponse = {
        status: true,
        message: 'Documentos reprocessados com sucesso, aguarde o processamento do TSI'
      };
      return of(mockResponseReinstate);
    } else if(url === '/api/tsi/v1/TSIUtilStamp/updateStamp') {
      const mockResponseReprocess: TsiAtuStampResponse = {
        sucess: true,
        message: 'Stamp atualizado com sucesso na tabela V80 para o alias C20'
      };
      return of(mockResponseReprocess);
    }
  }
}

xdescribe('TsiMonitorService', () => {
  let service: TsiMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpService, useClass: MockTsiService }],
    });
    service = TestBed.inject(TsiMonitorService);
  });

  it('deve criar o serviço do tsi-monitor-service', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a requisição', async () => {
    const mockResponseReprocess: TsiReprocessResponse = {
      status: true,
      message: 'Notas Fiscais reprocessadas com sucesso, aguarde o processamento do TSI'
    };
    const params: TsiReprocessRequest = {
      companyId: 'T1|D MG 01',
    };

    const bodyReprocess: TsiReprocessBody = {
      reprocessAll: true,
      items: []
    };
    const bodyJSON = JSON.stringify(bodyReprocess);
    const specResponse = await service.postReprocessInvoices(JSON.stringify(bodyReprocess), params).toPromise();
    expect(specResponse).toEqual(mockResponseReprocess);
  });
});




