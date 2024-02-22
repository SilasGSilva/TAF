import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCacheService } from '../../../core/services/http-cache.service';
import { EventRequest } from '../../models/EventRequest';
import { EventResponse } from '../../models/EventResponse';

@Injectable()
export class SocialListEventService extends HttpCacheService<
  EventRequest,
  EventResponse
> {
  private tafContext: string = sessionStorage.getItem('TAFContext');
  private tafFull: boolean = JSON.parse(sessionStorage.getItem('TAFFull'));

  constructor(protected injector: Injector) {
    super(injector);
  }

  public getListEvents(params: EventRequest): Observable<EventResponse> {
    return this.tafContext === 'gpe'
      ? this.get('/api/rh/esocial/v1/GPEEsocialEvents', params)
      : this.tafFull
      ? this.get('/api/rh/esocial/v1/TAFEsocialEvents', params)
      : this.get('/api/rh/esocial/v1/EsocialEvents', params);
  }
}
