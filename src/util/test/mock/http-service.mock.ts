import { Observable } from "rxjs";

export class HttpServiceMock {
    public get<T>(endpoint: string, queryParams = {}): Observable<T> {
        return;
    }

    public delete<T>(endpoint: string): Observable<T> {
        return;
    }

    public post<T>(
        endpoint: string,
        payload: object = {},
        queryParams = {}
    ): Observable<T> {

        return;
    }

    public put<T>(endpoint: string, payload: object): Observable<T> {
        return;
    }

    public getAsync<T>(endpoint: string, queryParams = {}): Promise<T> {
        return;
    }
}