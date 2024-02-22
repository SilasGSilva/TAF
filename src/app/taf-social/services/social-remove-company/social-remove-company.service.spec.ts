import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { SocialRemoveCompanyRequest } from './social-remove-company-request';
import { SocialRemoveCompanyResponse } from './social-remove-company-response';
import { SocialRemoveCompanyService } from './social-remove-company.service';

xdescribe('SocialRemoveCompanyService', () => {
  let service: SocialRemoveCompanyService;

  class MockHttpService {
    delete(): Observable<SocialRemoveCompanyResponse> {
      const dummyResponse = {
        statusMessage:
          "Transmissão efetuada com sucesso. Verifique o retorno da transmissão através da opção 'Detalhamento', selecionando o evento S-1000. Se a situação do evento for 'Evento Rejeitado', consulte sua inconsistência. Se o código da inconsistência for '1012', execute a rotina 'Exclusão por Período Fiscal' para remover os dados da base do TAF.",
      };
      return of(dummyResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpService, useClass: MockHttpService }],
    });
    service = TestBed.inject(SocialRemoveCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return the initial status environment', () => {
    const mockRequest: SocialRemoveCompanyRequest = {
      companyId: 'T1|D MG 01 ',
    };

    const mockResponse: SocialRemoveCompanyResponse = {
      statusMessage:
        "Transmissão efetuada com sucesso. Verifique o retorno da transmissão através da opção 'Detalhamento', selecionando o evento S-1000. Se a situação do evento for 'Evento Rejeitado', consulte sua inconsistência. Se o código da inconsistência for '1012', execute a rotina 'Exclusão por Período Fiscal' para remover os dados da base do TAF.",
    };

    service
      .getRemoveCompanyRet(mockRequest)
      .subscribe(statusMessage => expect(statusMessage).toEqual(mockResponse));
  });
});
