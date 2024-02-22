import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, retryWhen, take, tap } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export abstract class HttpCacheService<P, T> {
  protected _cachedResponses: Array<T> = [];
  protected httpService: HttpService;

  constructor(protected injector: Injector) {
    this.httpService = this.injector.get(HttpService);
  }

  private _httpGet(
    apiURL: string,
    params: P,
    retryAttempts: number = 3
  ): Observable<T> {
    let retryCount = 0;

    return this.httpService.get<T>(apiURL, params).pipe(
      map(response => {
        if (!response && retryCount !== retryAttempts) {
          throw new Error();
        }

        return response;
      }),
      retryWhen(errors =>
        errors.pipe(
          delay(5000),
          take(retryAttempts),
          tap(() => retryCount++)
        )
      ),
      tap(response => {
        this._cachedResponses.push(response);
      })
    );
  }

  protected get(
    apiURL: string,
    params: P,
    page: number = 1,
    retryAttempts?: number
  ): Observable<T> {
    return !!this._cachedResponses[page - 1]
      ? of<T>(this._cachedResponses[page - 1])
      : this._httpGet(apiURL, params, retryAttempts);
  }
}
