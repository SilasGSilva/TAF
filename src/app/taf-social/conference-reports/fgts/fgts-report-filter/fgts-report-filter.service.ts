import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { ReportEsocialBaseConferStatusRequest } from '../../conference-reports-models/ReportEsocialBaseConferStatusRequest';
import { ExecuteReportEsocialBaseConferResponse } from '../../conference-reports-models/ExecuteReportEsocialBaseConferResponse';
import { ReportEsocialBaseConferStatusResponse } from '../../conference-reports-models/ReportEsocialBaseConferStatusResponse';
import { ESocialBaseConferFgtsValuesResponse } from '../../conference-reports-models/ESocialBaseConferFgtsValuesResponse';
import { ESocialBaseConferFgtsValuesRequest } from '../../conference-reports-models/ESocialBaseConferFgtsValuesRequest';
import { ExecuteReportEsocialBaseConferRequestFgts } from '../../conference-reports-models/ExecuteReportEsocialBaseConferRequestFgts';
import { valueIsNull } from '../../../../../util/util';

@Injectable({
  providedIn: 'root',
})
export class FgtsReportFilterService {
  private exportParams = new BehaviorSubject({});
  public currentParams = this.exportParams.asObservable();

  constructor(private http: HttpService) {}

  private get isDatasul() {
    const proAppConfig = JSON.parse(sessionStorage.getItem('ERPAPPCONFIG'));
    return proAppConfig.productLine.toLowerCase() === 'datasul';
  }

  private get isRM() {
    const proAppConfig = JSON.parse(sessionStorage.getItem('ERPAPPCONFIG'));
    return proAppConfig.productLine.toLowerCase() === 'rm';
  }

  public postExecuteReport(
    payload: ExecuteReportEsocialBaseConferRequestFgts,
    menuContext: string
  ): Observable<ExecuteReportEsocialBaseConferResponse> {
    if (menuContext === 'gpe') {
      return this.http.post(
        '/api/rh/esocial/v1/GPEreportEsocialBaseConfer',
        payload
      );
    } else {
      return this.http.post(
        '/api/rh/esocial/v1/reportEsocialBaseConfer',
        payload
      );
    }
  }

  public getStatusReport(
    params: ReportEsocialBaseConferStatusRequest,
    menuContext: string
  ): Observable<ReportEsocialBaseConferStatusResponse> {
    if (menuContext === 'gpe') {
      return this.http.get(
        '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/Status',
        params
      );
    } else {
      return this.http.get(
        '/api/rh/esocial/v1/reportEsocialBaseConfer/Status',
        params
      );
    }
  }

  public getReportTable(
    params: ESocialBaseConferFgtsValuesRequest,
    menuContext: string
  ): Observable<ESocialBaseConferFgtsValuesResponse[]> {
    this.exportParams.next({
      companyId: params.companyId,
      differencesOnly: params.differencesOnly,
      requestId: params.requestId,
      synthetic: params.synthetic,
    });
    if (menuContext === 'gpe') {
      return this.http.get(
        '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/FgtsValues',
        params
      );
    } else {
      return this.http.get(
        '/api/rh/esocial/v1/reportEsocialBaseConfer/FgtsValues',
        params
      );
    }
  }

  public getReportCard(
    params: ESocialBaseConferFgtsValuesRequest,
    menuContext: string
  ): Observable<ESocialBaseConferFgtsValuesResponse[]> {
    if (menuContext === 'gpe') {
      return this.http.get(
        '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/FgtsValues',
        params
      );
    } else {
      return this.http.get(
        '/api/rh/esocial/v1/reportEsocialBaseConfer/FgtsValues',
        params
      );
    }
  }

  public getCompany(): string {
    let company = { company_code: null, branch_code: null };
    let companyId = '';

    if (!this.isDatasul) {
      company = JSON.parse(sessionStorage['TAFCompany']);

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
