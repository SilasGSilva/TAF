import { ExportXmlRequest } from './../../../models/export-xml-request';
import { ExportXmlResponse } from 'taf-fiscal/models/export-xml-response';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';

import { ExportReport } from '../../../models/export-report';
import { ExportReportService } from './export-report.service';
import { ExportReportModule } from './export-report.module';
import { HttpService } from 'core/services/http.service';
import { ExportReportResponse } from 'taf-fiscal/models/export-report-response';

xdescribe('ExportReportService', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let exportReport: ExportReportService;
  let fakeExportReportPayload: ExportReport;
  let dummyExportReportsResponse: { eventDetail: Array<ExportReportResponse> };
  let dummyExportXmlResponse: ExportXmlResponse;

  class MockHttpService {
    public dummyExportResponse: ExportXmlResponse | any
    get(url: string): any {
      this.dummyExportResponse = {
        eventDetail: [
          {
            aliquot: '0.11',
            totalTaxBase: '11250',
            issueDate: '2019-03-18T00:00:00',
            tax: '999',
            subcontractServiceValue: '0',
            additionalHoldValueNotConfirmed: '0',
            taxDocumentCode: '000000000002698',
            branch: 'D MG 01 ',
            observation: 'OBSERVACAO',
            valueServicesProvidedOnSpecialCondition15Years: '0',
            valueServicesProvidedOnSpecialCondition25Years: '0',
            invoiceSeries: 'A',
            taxNumber: '13089158000121',
            totalGrossValue: '11250',
            company: 'MILCLEAN 6',
            constructionSiteDescription: '',
            mainWithHoldingValue: '0',
            employeeCode: 'FF0229306',
            typeOfInscriptionEmployee: '1 - CNPJ',
            unpaiRetentionAmount: '0',
            grossValue: '11250',
            additionalHoldValue: '0',
            CPRB: '0',
            totalTaxes: '990',
            documentType: 'NFS',
            invoice: '000018933',
            taxBase: '29',
            serviceCode: '100000001',
            serviceProvidingIndication:
              '0 - Não é obra de construção civil ou não está sujeita a matrícula de obra',
            service: 'LIMPEZA, CONSERVACAO OU ZELADORIA',
            valueServicesProvidedOnSpecialCondition20Years: '0',
            additionalUnpaidRetentionAmount: '0',
            taxNumberBranch: '53113791000122',
          },
        ],
      };

      return of(this.dummyExportResponse);
    }

    post(url: string): any {
      this.dummyExportResponse = {
        sucess: true,
        message: "",
        exportXML: [
          {
            createZip: true,
            totalFound: 4,
            zipFile: "\\TAFXML\\XMLR5001R2010P112021.zip",
            totalDelete: 0,
            totalTss: 4,
            event: "R-2010",
            totalQuery: 4,
            createXml: true
          }
        ],
        event: "R-5001",
        totalEvent: 4,
        homeDirectory: "\\TAFXML\\"
      };

      return of(this.dummyExportResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ExportReportModule],
      providers: [{ provide: HttpService, useClass: MockHttpService }],
    });

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    exportReport = injector.get(ExportReportService);

    dummyExportReportsResponse = {
      eventDetail: [
        {
          aliquot: '0.11',
          totalTaxBase: '11250',
          issueDate: '2019-03-18T00:00:00',
          tax: '999',
          subcontractServiceValue: '0',
          additionalHoldValueNotConfirmed: '0',
          taxDocumentCode: '000000000002698',
          branch: 'D MG 01 ',
          observation: 'OBSERVACAO',
          valueServicesProvidedOnSpecialCondition15Years: '0',
          valueServicesProvidedOnSpecialCondition25Years: '0',
          invoiceSeries: 'A',
          taxNumber: '13089158000121',
          totalGrossValue: '11250',
          company: 'MILCLEAN 6',
          constructionSiteDescription: '',
          mainWithHoldingValue: '0',
          employeeCode: 'FF0229306',
          typeOfInscriptionEmployee: '1 - CNPJ',
          unpaiRetentionAmount: '0',
          grossValue: '11250',
          additionalHoldValue: '0',
          CPRB: '0',
          totalTaxes: '990',
          documentType: 'NFS',
          invoice: '000018933',
          taxBase: '29',
          serviceCode: '100000001',
          serviceProvidingIndication:
            '0 - Não é obra de construção civil ou não está sujeita a matrícula de obra',
          service: 'LIMPEZA, CONSERVACAO OU ZELADORIA',
          valueServicesProvidedOnSpecialCondition20Years: '0',
          additionalUnpaidRetentionAmount: '0',
          taxNumberBranch: '53113791000122',
        },
      ],
    };

    dummyExportXmlResponse = {
      sucess: true,
      message: "",
      exportXML: [
        {
          createZip: true,
          totalFound: 4,
          zipFile: "\\TAFXML\\XMLR5001R2010P112021.zip",
          totalDelete: 0,
          totalTss: 4,
          event: "R-2010",
          totalQuery: 4,
          createXml: true
        }
      ],
      event: "R-5001",
      totalEvent: 4,
      homeDirectory: "\\TAFXML\\"
    };

    fakeExportReportPayload = {
      period: '032019',
      event: 'R-2010',
      companyId: 'T1|D MG 01',
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', inject(
    [ExportReportService],
    (exportService: ExportReportService) => {
      expect(exportService).toBeTruthy();
    }
  ));

  it('deve listar os dados do relatório', () => {
    exportReport.getReport(fakeExportReportPayload).subscribe(response => {
      expect(response).toEqual(dummyExportReportsResponse);
    });
  });

  it('deve retornar os diretórios que os arquivos Zip foram criados', () => {
    const params: ExportXmlRequest = {
      companyId: 'T1|D MG 01',
      period: '112021',
      event: 'R-5001'
    }

    exportReport.postExportXML(params).subscribe(response => {
      expect(response).toEqual(dummyExportXmlResponse);
    });
  });
});
