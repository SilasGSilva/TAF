import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { Observable, of } from 'rxjs';
import { tafSocialPt } from '../../../core/i18n/taf-social-pt';
import { HttpService } from '../../../core/services/http.service';
import { SocialStatusEnvironmentResponse } from '../../models/social-status-environment-response';
import { SocialStatusEnvironmentService } from './social-status-environment.service';

const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: true,
  },
  contexts: {
    tafSocial: {
      'pt-BR': tafSocialPt,
    },
  },
};

xdescribe('SocialStatusEnvironmentService', () => {
  let service: SocialStatusEnvironmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PoI18nModule.config(i18nConfig)],
      providers: [
        SocialStatusEnvironmentService,
        { provide: HttpService, useClass: MockSocialStatusEnvironmentService },
      ],
    });

    service = TestBed.inject(SocialStatusEnvironmentService);
    httpMock = TestBed.inject(HttpTestingController);

    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const tafFull = true;
    const tafContext = 'esocial';

    sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));
    sessionStorage.setItem('TAFFull', JSON.stringify(tafFull));
    sessionStorage.setItem('TAFContext', tafContext);
  });

  afterEach(() => {
    sessionStorage.removeItem('TAFCompany');
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar o status do ambiente em produção', async () => {
    const specRequest = { companyId: 'T1|D MG 01' };

    await service
      .getSocialStatusEnvironment(specRequest)
      .toPromise()
      .then(specResponse =>
        expect(specResponse).toEqual({
          statusEnvironmentSocial: 'production',
          versionLayoutSocial: 'S_01_00_00',
          tssEntity: '000002',
          versionTSS: '12.1.27 | 3.0',
        })
      );
  });

  it('deve retornar o status do ambiente e versão do layout em produção', async () => {
    const mockCompanyId = {
      companyId: 'T1|D MG 01',
    };

    await service
      .getSocialStatusEnvironment(mockCompanyId)
      .toPromise()
      .then(specResponse =>
        expect(specResponse).toEqual({
          statusEnvironmentSocial: 'production',
          versionLayoutSocial: 'S_01_00_00',
          tssEntity: '000002',
          versionTSS: '12.1.27 | 3.0',
        })
      );
  });
});

export class MockSocialStatusEnvironmentService {
  public dummyResponse: SocialStatusEnvironmentResponse;

  get(url: string): Observable<SocialStatusEnvironmentResponse> {
    if (url === '/api/rh/esocial/v1/statusEnvironmentSocial') {
      this.dummyResponse = {
        statusEnvironmentSocial: 'production',
        versionLayoutSocial: 'S_01_00_00',
        tssEntity: '000002',
        versionTSS: '12.1.27 | 3.0',
      };
    }

    return of(this.dummyResponse);
  }
}
