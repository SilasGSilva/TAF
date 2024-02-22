import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http.service';
import { Observable } from 'rxjs';
import { EsocialDetailsErrorRequest } from '../social-monitor-models/EsocialDetailsErrorRequest';
import { EsocialDetailsErrorResponse } from '../social-monitor-models/EsocialDetailsErrorResponse';
import { EsocialDetailsFilter } from '../social-monitor-models/EsocialDetailsFilter';
import { EsocialEventDetails } from '../social-monitor-models/EsocialEventDetails';

@Injectable({
  providedIn: 'root',
})
export class MonitorDetailService {
  constructor(private http: HttpService) {}

  public getDetailsError(
    filters: EsocialDetailsErrorRequest,
    menuContext: string,
    isTAFFUll: boolean
  ): Observable<EsocialDetailsErrorResponse> {
    if (menuContext === 'gpe') {
      return this.http.get('/api/rh/esocial/v1/GPEEsocialDetailError', filters);
    } else {
      return isTAFFUll
        ? this.http.get('/api/rh/esocial/v1/TAFEsocialDetailError', filters)
        : this.http.get('/api/rh/esocial/v1/EsocialDetailError', filters);
    }
  }

  public getEventDetails(
    filters: EsocialDetailsFilter,
    menuContext: string,
    isTAFFUll: boolean
  ): Observable<EsocialEventDetails> {
    if (menuContext === 'gpe') {
      return this.http.post(
        '/api/rh/esocial/v1/GPEEsocialDetailTransmission',
        filters
      );
    } else {
      return isTAFFUll
        ? this.http.post(
            '/api/rh/esocial/v1/TAFEsocialDetailTransmission',
            filters
          )
        : this.http.post(
            '/api/rh/esocial/v1/EsocialDetailTransmission',
            filters
          );
    }
  }
}
