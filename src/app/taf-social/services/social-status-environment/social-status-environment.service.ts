import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCacheService } from '../../../core/services/http-cache.service';
import { SocialStatusEnvironmentRequest } from '../../models/social-status-environment-request';
import { SocialStatusEnvironmentResponse } from '../../models/social-status-environment-response';

@Injectable({
  providedIn: 'root',
})
export class SocialStatusEnvironmentService extends HttpCacheService<
  SocialStatusEnvironmentRequest,
  SocialStatusEnvironmentResponse
> {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public getSocialStatusEnvironment(
    params: SocialStatusEnvironmentRequest
  ): Observable<SocialStatusEnvironmentResponse> {
    return this.get('/api/rh/esocial/v1/statusEnvironmentSocial', params);
  }
}
