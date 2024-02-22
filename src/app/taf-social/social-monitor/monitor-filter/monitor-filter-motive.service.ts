import { Injectable, Injector } from '@angular/core';

import { MotiveRequest } from '../social-monitor-models/MotiveRequest';
import { MotiveResponse } from '../social-monitor-models/MotiveResponse';

import { HttpCacheService } from '../../../core/services/http-cache.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MonitorFilterMotiveService extends HttpCacheService<
  MotiveRequest,
  MotiveResponse
> {
  private tafContext: string = sessionStorage.getItem('TAFContext');

  constructor(protected injector: Injector) {
    super(injector);
  }

  public getListMotives(
    params: MotiveRequest,
    page?: number
  ): Observable<MotiveResponse> {
    return this.tafContext === 'gpe'
      ? this.get('/api/rh/esocial/v1/GPEEsocialMotives', params, page)
      : this.get('/api/rh/esocial/v1/EsocialMotives', params, page);
  }
}
