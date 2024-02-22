import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http.service';
import { HttpCacheService } from 'core/services/http-cache.service';
import { TsiStatusResponse } from './../../../models/tsi-status-response';
import { TsiStatusRequest } from './../../../models/tsi-status-request';

@Injectable({
  providedIn: 'root'
})
export class TsiStatusService extends HttpCacheService<TsiStatusRequest, TsiStatusResponse> {
  constructor(protected injector: Injector, private http: HttpService) {
    super(injector);
  }
  public getTsiStatus(payload: TsiStatusRequest): Observable<TsiStatusResponse> {
    return this.get('/api/tsi/v1/TSIServiceStatus', payload);
  }
}
