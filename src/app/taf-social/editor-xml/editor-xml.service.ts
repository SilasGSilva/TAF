import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { GetXmlEditRequest } from './editor-xml-models/GetXmlEditRequest';
import { GetXmlEditResponse } from './editor-xml-models/GetXmlEditResponse';
import { SaveXmlEditRequest } from './editor-xml-models/SaveXmlEditRequest';
import { SaveXMLEditResponse } from './editor-xml-models/SaveXMLEditResponse';
import { valueIsNull } from '../../../util/util';

@Injectable({
  providedIn: 'root',
})
export class EditorXmlService {
  constructor(private http: HttpService) {}

  public get isDatasul() {
    const proAppConfig = JSON.parse(sessionStorage.getItem('ERPAPPCONFIG'));
    return proAppConfig.productLine.toLowerCase() === 'datasul';
  }

  public saveXmlEdit(
    params: SaveXmlEditRequest,
    menuContext: string
  ): Observable<SaveXMLEditResponse> {
    return menuContext === 'gpe'
      ? this.http.post('/api/rh/esocial/v1/GPEEsocialXMLMessage', params)
      : this.http.post('/api/rh/esocial/v1/EsocialXMLMessage', params);
  }

  public getXmlEdit(
    params: GetXmlEditRequest,
    menuContext: string,
    isTAFFull: boolean
  ): Observable<GetXmlEditResponse> {
    if (menuContext === 'gpe') {
      return this.http.get('/api/rh/esocial/v1/GPEEsocialXMLMessage', params);
    } else {
      return isTAFFull
        ? this.http.get('/api/rh/esocial/v1/TAFEsocialXMLMessage', params)
        : this.http.get('/api/rh/esocial/v1/EsocialXMLMessage', params);
    }
  }

  public getCompany(): string {
    let company = { company_code: null, branch_code: null };
    let companyId = '';

    if (!this.isDatasul) {
      company =JSON.parse(sessionStorage['TAFCompany']);

      if (!valueIsNull(company.company_code)) {
        companyId = company.company_code;
      }

      if (!valueIsNull(company.branch_code)) {
        companyId += `|${company.branch_code}`;
      }
    }
    return companyId;
  }
}
