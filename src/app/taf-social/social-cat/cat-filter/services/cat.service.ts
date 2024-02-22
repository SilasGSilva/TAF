import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CatValuesRequestMonitor } from './../../social-cat-models/CatValuesRequestMonitor';
import { CatValuesRequest } from '../../social-cat-models/CatValuesRequest';
import { CatValuesResponse } from '../../social-cat-models/CatValuesResponse';
import { CatStatusRequest } from '../../social-cat-models/CatStatusRequest';
import { CatStatusResponse } from '../../social-cat-models/CatStatusResponse';
import { CatExecuteRequest } from '../../social-cat-models/CatRequest';
import { CatExecuteResponse } from '../../social-cat-models/CatExecuteResponse';
import { CatPrintReportService } from '../../cat-report/services/cat-print-report.service';
import { HttpService } from 'core/services/http.service';

@Injectable()
export class CatServices {
  public requestCurrentParams: Object;

  constructor(
    private http: HttpService,
    private catPrintReportService: CatPrintReportService
  ) {}

  public postExecutCat(
    payload: CatExecuteRequest
  ): Observable<CatExecuteResponse> {
    return this.http.post('/api/rh/esocial/v1/CatReport', payload);
  }

  public getStatusCat(params: CatStatusRequest): Observable<CatStatusResponse> {
    return this.http.get('/api/rh/esocial/v1/CatReport/status', params);
  }

  public postValuesCat(
    payload: CatValuesRequest
  ): Observable<CatValuesResponse> {
    this.requestCurrentParams = {
      companyId: payload.companyId,
      requestId: payload.requestId,
    };

    return this.http.post('/api/rh/esocial/v1/CatReport/catValues', payload);
  }

  public postValuesCatMonitor(
    payload: CatValuesRequestMonitor
  ): Observable<CatValuesResponse> {
    return this.http.post('/api/rh/esocial/v1/CatReport/catMonitorValues', payload);
  }

  public printCatReport(keysSelected: Array<string>): Observable<string> {
    const bodyRequest: CatValuesRequest = {
      companyId: this.requestCurrentParams['companyId'],
      requestId: this.requestCurrentParams['requestId'],
      sequencial: keysSelected
    };

    return this.postValuesCat(bodyRequest).pipe(
      switchMap(response =>
        from(this.catPrintReportService.printReport(response.items))
      )
    );
  }

  public printCatReportMonitor(keysSelected: Array<string>, companyId?: string): Observable<string> {
    const bodyRequest: CatValuesRequestMonitor = {
      companyId,
      key: keysSelected
    };

    return this.postValuesCatMonitor(bodyRequest).pipe(
      switchMap(response =>
        from(this.catPrintReportService.printReport(response.items))
      )
    );
  }

  public downloadCatReport(printMode: string): void {
    this.catPrintReportService.downloadReport(printMode);
  }
}
