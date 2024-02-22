import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http.service';
import { Observable } from 'rxjs';
import { filter, startWith, tap } from 'rxjs/operators';
import { EsocialMonitorHomeCardsRequest } from '../social-monitor-models/EsocialMonitorHomeCardsRequest';
import { EventCard } from './EventCard';

@Injectable({
  providedIn: 'root',
})
export class MonitorEventsCardsService {
  private _cachedResponse: any = {};
  private _apiURL: string;

  constructor(private http: HttpService) {}

  private _httpPost(
    filters: EsocialMonitorHomeCardsRequest
  ): Observable<EventCard> {
    return this.http.post<EventCard>(this._apiURL, filters);
  }

  public getEventsCards(
    filters: EsocialMonitorHomeCardsRequest,
    menuContext: string,
    isTAFFull: boolean,
    cache: boolean = false
  ): Observable<EventCard> {
    menuContext === 'gpe'
      ? (this._apiURL = '/api/rh/esocial/v1/GPEEsocialMonitorHomeCards')
      : isTAFFull
      ? (this._apiURL = '/api/rh/esocial/v1/TAFEsocialMonitorHomeCards')
      : (this._apiURL = '/api/rh/esocial/v1/EsocialMonitorHomeCards');

    return cache
      ? this._httpPost(filters).pipe(
          tap(response => (this._cachedResponse = response)),
          startWith(this._cachedResponse || {}),
          filter(response => Object.keys(response).length !== 0)
        )
      : this._httpPost(filters).pipe(
          tap(response => (this._cachedResponse = response))
        );
  }
}
