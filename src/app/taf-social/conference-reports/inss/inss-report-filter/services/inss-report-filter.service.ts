import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http.service';
import { Observable } from 'rxjs';
import { valueIsNull } from '../../../../../../util/util';
import { ESocialBaseConferRetValuesRequest } from '../../../conference-reports-models/ESocialBaseConferRetValuesRequest';
import { ESocialBaseConferInssRetValuesResponse } from '../../../conference-reports-models/ESocialBaseConferInssRetValuesResponse';
import { ESocialBaseConferValuesRequest } from '../../../conference-reports-models/ESocialBaseConferValuesRequest';
import { ESocialBaseConferInssValuesResponse } from '../../../conference-reports-models/ESocialBaseConferInssValuesResponse';
import { ExecuteReportEsocialBaseConferRequest } from '../../../conference-reports-models/ExecuteReportEsocialBaseConferRequest';
import { ExecuteReportEsocialBaseConferResponse } from '../../../conference-reports-models/ExecuteReportEsocialBaseConferResponse';
import { ReportEsocialBaseConferStatusRequest } from '../../../conference-reports-models/ReportEsocialBaseConferStatusRequest';
import { ReportEsocialBaseConferStatusResponse } from '../../../conference-reports-models/ReportEsocialBaseConferStatusResponse';
import { InssReportParamsStoreService } from '../../../services/stores/inss/inss-report-params-store/inss-report-params-store.service';
import { InssReportRequestParamsStoreService } from '../../../services/stores/inss/inss-report-request-params-store/inss-report-request-params-store.service';

@Injectable({
  providedIn: 'root',
})
export class InssReportFilterService {

  constructor(
    private http: HttpService,
    private inssReportParamsStoreService: InssReportParamsStoreService,
    private inssReportRequestParamsStoreService: InssReportRequestParamsStoreService
  ) {}

  private get isDatasul() {
    const proAppConfig = JSON.parse(sessionStorage.getItem('ERPAPPCONFIG'));
    return proAppConfig.productLine.toLowerCase() === 'datasul';
  }

  public postExecuteReport(
    payload: ExecuteReportEsocialBaseConferRequest,
    menuContext: string
  ): Observable<ExecuteReportEsocialBaseConferResponse> {
    this.inssReportRequestParamsStoreService.addRequestParams(payload);
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

  public getInssRetValues(
    params: ESocialBaseConferRetValuesRequest,
    menuContext: string
  ): Observable<ESocialBaseConferInssRetValuesResponse> {
    this.inssReportParamsStoreService.addParams(params);

    if (menuContext === 'gpe') {
      return this.http.get(
        '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/InssRetValues',
        params
      );
    } else {
      return this.http.get(
        '/api/rh/esocial/v1/reportEsocialBaseConfer/InssRetValues',
        params
      );
    }
  }

  public getReportCard(
    params: ESocialBaseConferValuesRequest,
    menuContext: string
  ): Observable<ESocialBaseConferInssValuesResponse[]> {
    if (menuContext === 'gpe') {
      return this.http.get(
        '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/InssValues',
        params
      );
    } else {
      return this.http.get(
        '/api/rh/esocial/v1/reportEsocialBaseConfer/InssValues',
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
