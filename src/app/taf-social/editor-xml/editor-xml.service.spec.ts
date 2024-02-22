import { TestBed, fakeAsync } from '@angular/core/testing';

import { EditorXmlService } from './editor-xml.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpService } from 'core/services/http.service';

xdescribe('EditorXmlService', () => {
  let httpTestingController: HttpTestingController;
  let service: EditorXmlService;
  const esocialContext = 'esocial';
  const gpeContext = 'gpe';

  class MockHttpService {
    get(url: string): any {
      const dummyResponse = {
        xmlType: 'S-1010',
        xmlMessage:
          'PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0ndXRmLTgnPz48ZVNvY2lhbCB4bWxucz0naHR0cDovL3d3dy5lc29jaWFsLmdvdi5ici9zY2hlbWEvZXZ0L2V2dFRhYlJ1YnJpY2EvdjAyXzA1XzAwJz48ZXZ0VGFiUnVicmljYSBJZD0nSUQxMjcyMzExODUwMDAwMDAyMDE5MDUwNjEyMDMxODA1NTI1Jz48aWRlRXZlbnRvPjx0cEFtYj4yPC90cEFtYj48cHJvY0VtaT4xPC9wcm9jRW1pPjx2ZXJQcm9jPjEuMDwvdmVyUHJvYz48L2lkZUV2ZW50bz48aWRlRW1wcmVnYWRvcj48dHBJbnNjPjE8L3RwSW5zYz48bnJJbnNjPjI3MjMxMTg1PC9uckluc2M',
      };

      return of(dummyResponse);
    }

    post(url: string): any {
      const dummyResponse = {
        success: true,
        message: '',
      };

      return of(dummyResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EditorXmlService,
        { provide: HttpService, useClass: MockHttpService },
      ],
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EditorXmlService);

    sessionStorage['ERPAPPCONFIG'] = { productLine: 'Protheus' };
  });

  it('deve criar o serviço editor xml', () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o GET da API e retornar os dados corretamente',  async () => {
    const mockRequest = {
      companyId: 'T1|D MG 01',
      id: 'TAFKEY_123456',
    };

    const mockEsocialXMLMessage = {
      xmlType: 'S-1010',
      xmlMessage:
        'PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0ndXRmLTgnPz48ZVNvY2lhbCB4bWxucz0naHR0cDovL3d3dy5lc29jaWFsLmdvdi5ici9zY2hlbWEvZXZ0L2V2dFRhYlJ1YnJpY2EvdjAyXzA1XzAwJz48ZXZ0VGFiUnVicmljYSBJZD0nSUQxMjcyMzExODUwMDAwMDAyMDE5MDUwNjEyMDMxODA1NTI1Jz48aWRlRXZlbnRvPjx0cEFtYj4yPC90cEFtYj48cHJvY0VtaT4xPC9wcm9jRW1pPjx2ZXJQcm9jPjEuMDwvdmVyUHJvYz48L2lkZUV2ZW50bz48aWRlRW1wcmVnYWRvcj48dHBJbnNjPjE8L3RwSW5zYz48bnJJbnNjPjI3MjMxMTg1PC9uckluc2M',
    };
  
    let isTAFFull = true;

    const specResponseEsocial = await service.getXmlEdit(mockRequest, esocialContext, isTAFFull).toPromise();
    expect(specResponseEsocial.xmlMessage).toEqual(mockEsocialXMLMessage.xmlMessage);

    isTAFFull = false;

    const specResponseGPE = await service.getXmlEdit(mockRequest, gpeContext, isTAFFull).toPromise();
    expect(specResponseGPE.xmlMessage).toEqual(mockEsocialXMLMessage.xmlMessage);

  });

  it('deve realizar o POST da API e retornar a requisição com sucesso', async () => {
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      id: 'TAFKEY_123456',
      user: '000001',
      xmlMessage:
        'PGVTb2NpYWwgeG1sbnM9Imh0dHA6Ly93d3cuZXNvY2lhbC5nb3YuYnIvc2NoZW1hL2V2dC9ldnRUYWJSdWJyaWNhL3YwMl8wNV8wMCI+CiAgPGV2dFRhYlJ1YnJpY2EgSWQ9IklEMTI3MjMxMTg1MDAwMDAwMjAxOTA1MDYxMjAzMTgwNTUyNSI+CiAgICA8aWRlRXZlbnRvPgogICAgICA8dHBBbWI+MjwvdHBBbWI+CiAgICAgIDxwcm9jRW1pPjE8L3Byb2NFbWk+CiAgICAgIDx2ZXJQcm9jPjEuMDwvdmVyUHJvYz4KICAgIDwvaWRlRXZlbnRvPgogICAgPGlkZUVtcHJlZ2Fkb3I+CiAgICAgIDx0cEluc2M+MTwvdHBJbnNjPgogICAgICA8bnJJbnNjPjI3MjMxMTg1PC9uckluc2M+CiAgICA8L2lkZUVtcHJlZ2Fkb3I+CiAgICA8aW5mb1J1YnJpY2E+CiAgICAgIDxpbmNsdXNhbz4KICAgICAgICA8aWRlUnVicmljYT4KICAgICAgICAgIDxjb2RSdWJyPjExLTM0NTwvY29kUnVicj4KICAgICAgICAgIDxpZGVUYWJSdWJyPjAwMDAwMTwvaWRlVGFiUnVicj4KICAgICAgICAgIDxpbmlWYWxpZD4yMDE4LTAxPC9pbmlWYWxpZD4KICAgICAgICA8L2lkZVJ1YnJpY2E+CiAgICAgICAgPGRhZG9zUnVicmljYT4KICAgICAgICAgIDxkc2NSdWJyPkNMwz9OSUNBIFPDg08gTUFSQ09TPC9kc2NSdWJyPgogICAgICAgICAgPG5hdFJ1YnI+OTI1ODwvbmF0UnVicj4KICAgICAgICAgIDx0cFJ1YnI+MjwvdHBSdWJyPgogICAgICAgICAgPGNvZEluY0NQPjAwPC9jb2RJbmNDUD4KICAgICAgICAgIDxjb2RJbmNJUlJGPjAwPC9jb2RJbmNJUlJGPgogICAgICAgICAgPGNvZEluY0ZHVFM+MDA8L2NvZEluY0ZHVFM+CiAgICAgICAgICA8Y29kSW5jU0lORD4wMDwvY29kSW5jU0lORD4KICAgICAgICA8L2RhZG9zUnVicmljYT4KICAgICAgPC9pbmNsdXNhbz4KICAgIDwvaW5mb1J1YnJpY2E+CiAgPC9ldnRUYWJSdWJyaWNhPgo8L2VTb2NpYWw+',
    };

    const mockResponse = {
      success: true,
      message: '',
    };

    const specResponseEsocial = await service.saveXmlEdit(mockRequest, esocialContext).toPromise();
    expect(mockResponse.success).toEqual(specResponseEsocial.success);

    const specResponseGPE = await service.saveXmlEdit(mockRequest, gpeContext).toPromise();
    expect(mockResponse.success).toEqual(specResponseGPE.success);
  });

  it('deve retornar o valor da tag TAFCompany na sessionstorage, quando não for DataSul', () => {
    const companyId = 'T1|D MG 01 ';
    let response: string;

    sessionStorage['ERPAPPCONFIG'] = '{"productLine": "Protheus"}';
    sessionStorage['TAFCompany'] =
      '{"company_code":"T1","branch_code":"D MG 01 "}';

    response = service.getCompany();
    expect(response).toEqual(companyId);
  });

  it('deve retornar o valor da tag TAFCompany na sessionstorage, quando for DataSul', () => {
    const companyId = '';
    let response: string;

    sessionStorage['ERPAPPCONFIG'] = '{"productLine": "Datasul"}';
    response = service.getCompany();

    expect(response).toEqual(companyId);
  });

  it('deve retornar o valor da tag TAFCompany na sessionstorage, quando não for DataSul', () => {
    const companyId = 'T1|D MG 01 ';
    let response: string;

    sessionStorage['ERPAPPCONFIG'] = '{"productLine": "Protheus"}';
    sessionStorage['TAFCompany'] =
      '{"company_code":"T1","branch_code":"D MG 01 "}';

    response = service.getCompany();
    expect(response).toEqual(companyId);
  });

  it('deve retornar o valor da tag TAFCompany na sessionstorage, quando for DataSul', () => {
    const companyId = '';
    let response: string;

    sessionStorage['ERPAPPCONFIG'] = '{"productLine": "Datasul"}';
    response = service.getCompany();

    expect(response).toEqual(companyId);
  });
});
