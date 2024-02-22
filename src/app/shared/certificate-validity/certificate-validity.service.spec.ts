import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { CertificateValidityService } from 'shared/certificate-validity/certificate-validity.service';
import { HttpService } from './../../core/services/http.service';
import { CertificateValidityRequest } from './../../models/certificate-validity-request';
import { CertificateValidityResponse } from './../../models/certificate-validity-response';
import { sharedPt } from './../../core/i18n/shared-pt';
import { HttpCacheService } from './../../core/services/http-cache.service';

xdescribe('CertificateValidityService', () => {
  let service: CertificateValidityService;

  const i18nConfig: PoI18nConfig = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: true,
    },
    contexts: {
      share: {
        'pt-BR': sharedPt,
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PoI18nModule.config(i18nConfig)],
      providers: [
        { provide: HttpCacheService, useClass: MockCertificateValidityService },
      ],
    });
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const tafFull = true;
    const tafContext = 'esocial';

    sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));
    sessionStorage.setItem('TAFFull', JSON.stringify(tafFull));
    sessionStorage.setItem('TAFContext', tafContext);

    service = TestBed.inject(CertificateValidityService);
  });

  it('deve criar o serviço do certificate-validity-service', () => {
    expect(service).toBeTruthy();
  });

  it('deve mostrar a validade do certificado', () => {
    const spyCanShowCertificate = spyOn(
      service,
      'canShowCertificate'
    ).and.callThrough();

    service.canShowCertificate();
    expect(spyCanShowCertificate).toHaveBeenCalled();
  });
});

export class MockCertificateValidityService {
  get(url: string): Observable<CertificateValidityResponse> {
    let mockResponse: CertificateValidityResponse;
    if (url === '/api/rh/esocial/v1/certificateValidity') {
      mockResponse = {
        issuer: '/C=BR/O=ICP-Brasil/OU=AC SOLUTI v5/CN=AC SOLUTI Multipla v5',
        version: '2',
        subject:
          '/C=BR/O=ICP-Brasil/ST=SP/L=Sao Paulo/OU=AC SOLUTI Multipla v5/OU=13349466000149/OU=Presencial/OU=Certificado PJ A1/CN=TOTVS S.A.:53113791000122',
        certificateType: '2',
        validFrom: '20201117',
        validTo: '20211117',
      };
    }
    return of(mockResponse);
  }
}
