import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { LegacyStatusEnvironmentSocial } from '../../../models/legacy-status-environment-social';
import { LegacyStatusEnvironmentSocialRequest } from '../../../models/legacy-status-environment-social-request';
import { LegacyStatusEnvironmentSocialService } from './legacy-status-environment.service';

xdescribe('LegacyStatusEnvironmentSocialService', () => {
  let service: LegacyStatusEnvironmentSocialService;

  class MockHttpService {
    get(): Observable<LegacyStatusEnvironmentSocial> {
      const dummyResponse = {
        isAvailable: true,
        isConfigured: true,
        inssIsUpToDate: true,
        fgtsIsUpToDate: true,
        irrfIsUpToDate: true,
        apiReturnError: null,
      };

      return of(dummyResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpService, useClass: MockHttpService }],
    });
    service = TestBed.inject(LegacyStatusEnvironmentSocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return the initial status environment', () => {
    const mockRequest: LegacyStatusEnvironmentSocialRequest = {
      companyId: 'T1|D MG 01 ',
    };
    const mockResponse: LegacyStatusEnvironmentSocial = {
      isAvailable: true,
      isConfigured: true,
      inssIsUpToDate: true,
      fgtsIsUpToDate: true,
      irrfIsUpToDate: true,
      apiReturnError: null,
    };

    service
      .getLegacyStatusEnvironment(mockRequest)
      .subscribe(status => expect(status).toEqual(mockResponse));
  });
});
