import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http.service';
import { Observable } from 'rxjs';
import { EsocialMonitorTransmissionRequest } from '../social-monitor-models/EsocialMonitorTransmissionRequest';
import { EsocialMonitorTransmissionResponse } from '../social-monitor-models/EsocialMonitorTransmissionResponse';

@Injectable({
  providedIn: 'root',
})
export class MonitorHeaderActionsService {
  constructor(private http: HttpService) {}

  public startTransmission(
    params: EsocialMonitorTransmissionRequest,
    menuContext: string,
    isTAFFUll: boolean
  ): Observable<EsocialMonitorTransmissionResponse> {
    if (menuContext === 'gpe') {
      return this.http.post(
        '/api/rh/esocial/v1/GPEEsocialMonitorTransmission',
        params
      );
    } else {
      return isTAFFUll
        ? this.http.post(
            '/api/rh/esocial/v1/TAFEsocialMonitorTransmission',
            params
          )
        : this.http.post(
            '/api/rh/esocial/v1/EsocialMonitorTransmission',
            params
          );
    }
  }
}
