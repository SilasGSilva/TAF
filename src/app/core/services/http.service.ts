import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public get<T>(endpoint: string, queryParams = {}): Observable<T> {
    const params = new HttpParams({
      fromObject: queryParams,
    });
    return this.http.get<T>(endpoint, { params }).pipe(take(1));
  }

  public delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(endpoint).pipe(take(1));
  }

  public post<T>(
    endpoint: string,
    payload: object = {},
    queryParams = {}
  ): Observable<T> {
    const params = new HttpParams({
      fromObject: queryParams,
    });
    return this.http
      .post<T>(endpoint, payload, { params })
      .pipe(take(1));
  }

  public put<T>(endpoint: string, payload: object): Observable<T> {
    return this.http.put<T>(endpoint, payload).pipe(take(1));
  }

  public getAsync<T>(endpoint: string, queryParams = {}): Promise<T> {
    const params = new HttpParams({
      fromObject: queryParams,
    });
    return this.http.get<T>(endpoint, { params }).toPromise();
  }
}
