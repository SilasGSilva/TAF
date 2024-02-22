import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { LegacyStatusEnvironmentSocial } from '../../../models/legacy-status-environment-social';
import { LegacyStatusEnvironmentSocialRequest } from '../../../models/legacy-status-environment-social-request';

@Injectable({
  providedIn: 'root',
})
export class LegacyStatusEnvironmentSocialService {
  constructor(private httpService: HttpService) {}

  public getLegacyStatusEnvironment(
    params: LegacyStatusEnvironmentSocialRequest
  ): Observable<LegacyStatusEnvironmentSocial> {
    return this.httpService.get(
      '/api/rh/esocial/v1/reportEsocialBaseConfer/LegacyStatus',
      params
    );
  }
}
