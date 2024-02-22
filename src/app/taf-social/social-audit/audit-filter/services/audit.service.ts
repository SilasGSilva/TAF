import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuditChartSeriesRequest } from './../../social-audit-models/AuditChartSeriesRequest';
import { AuditChartSeriesResponse } from '../../social-audit-models/AuditChartSeriesResponse';
import { AuditValuesRequest } from './../../social-audit-models/AuditValuesRequest';
import { AuditValuesResponse } from '../../social-audit-models/AuditValuesResponse';
import { AuditStatusRequest } from './../../social-audit-models/AuditStatusRequest';
import { AuditStatusResponse } from './../../social-audit-models/AuditStatusResponse';
import { AuditExecuteRequest } from './../../social-audit-models/AuditRequest';
import { AuditExecuteResponse } from './../../social-audit-models/AuditExecuteResponse';
import { HttpService } from 'core/services/http.service';

@Injectable()
export class AuditService {
  private exportParams = new BehaviorSubject({});
  private currentParams = this.exportParams.asObservable();

  constructor(private http: HttpService) { }

  public postExecuteAudit(payload: AuditExecuteRequest): Observable<AuditExecuteResponse> {
    return this.http.post('/api/rh/esocial/v1/EsocialAudit', payload);
  }

  public getStatusAudit(params: AuditStatusRequest): Observable<AuditStatusResponse> {
    return this.http.get('/api/rh/esocial/v1/EsocialAudit/status', params);
  }

  public getChartSeriesAudit(params: AuditChartSeriesRequest): Observable<AuditChartSeriesResponse> {
    return this.http.get('/api/rh/esocial/v1/EsocialAudit/chartValues', params);
  }

  public getValuesAudit(params: AuditValuesRequest): Observable<AuditValuesResponse> {
    this.exportParams.next({
      companyId: params.companyId,
      requestId: params.requestId
    });

    return this.http.get('/api/rh/esocial/v1/EsocialAudit/auditValues', params);
  }

  public getCurrentParams(): Observable<Object> {
    return this.currentParams;
  }
}
