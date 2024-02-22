import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { SocialRemoveCompanyRequest } from './social-remove-company-request';
import { SocialRemoveCompanyResponse } from './social-remove-company-response';

@Injectable({
  providedIn: 'root',
})
export class SocialRemoveCompanyService {
  constructor(private httpService: HttpService) {}

  public getRemoveCompanyRet(
    params: SocialRemoveCompanyRequest
  ): Observable<SocialRemoveCompanyResponse> {
    return this.httpService.delete<SocialRemoveCompanyResponse>(
      `/api/rh/esocial/v1/TAFEsocialRemoveCompany/${params.companyId}`
    );
  }
}
