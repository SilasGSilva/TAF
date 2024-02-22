import { Injectable } from '@angular/core';
import { valueIsNull } from '@totvs/protheus-lib-core';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http.service';
import { ESocialBaseConferRetValuesRequest } from './../../../conference-reports-models/ESocialBaseConferRetValuesRequest';
import { ReportEsocialBaseConferStatusResponse } from './../../../conference-reports-models/ReportEsocialBaseConferStatusResponse';
import { ExecuteReportEsocialBaseConferRequest } from './../../../conference-reports-models/ExecuteReportEsocialBaseConferRequest';
import { ExecuteReportEsocialBaseConferResponse } from './../../../conference-reports-models/ExecuteReportEsocialBaseConferResponse';
import { ReportEsocialBaseConferStatusRequest } from './../../../conference-reports-models/ReportEsocialBaseConferStatusRequest';
import { ESocialBaseConferIrrfRetValuesResponse } from './../../irrf-models/ESocialBaseConferIrrfRetValuesResponse';
import { IrrfReportParamsStoreService } from '../../../services/stores/irrf/irrf-report-params-store/irrf-report-params-store.service';
import { IrrfReportRequestParamsStoreService } from './../../../services/stores/irrf/irrf-report-request-params-store/irrf-report-request-params-store.service';

@Injectable()
export class IrrfReportFilterService {
  constructor(
    private http: HttpService,
    private irrfReportParamsStoreService: IrrfReportParamsStoreService,
    private irrfReportRequestParamsStoreService: IrrfReportRequestParamsStoreService,
  ) { }

  private get isDatasul() {
    const proAppConfig = JSON.parse(sessionStorage.getItem('ERPAPPCONFIG'));
    return proAppConfig.productLine.toLowerCase() === 'datasul';
  }

  public postExecuteReport(
    payload: ExecuteReportEsocialBaseConferRequest,
    menuContext: string
  ): Observable<ExecuteReportEsocialBaseConferResponse> {
    this.irrfReportRequestParamsStoreService.addRequestParams(payload);

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

  public getIrrfRetValues(
    params: ESocialBaseConferRetValuesRequest,
    menuContext: string
  ): Observable<ESocialBaseConferIrrfRetValuesResponse> {
    this.irrfReportParamsStoreService.addParams(params);

    if (menuContext === 'gpe') {
      return this.http.get(
        '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/IrrfRetValues',
        params
      );
    } else {
      return this.http.get(
        '/api/rh/esocial/v1/reportEsocialBaseConfer/IrrfRetValues',
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
