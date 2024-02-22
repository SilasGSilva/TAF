import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http.service';
import { TsiIntegrationErrorsRequest } from './../../models/tsi-integrations-errors-request';
import { TsiIntegrationErrorsResponse } from './../../models/tsi-integrations-errors-response';

@Injectable({
  providedIn: 'root'
})

export class TsiTableService {

  constructor(private httpService: HttpService) { }

  public getTsiErrors(payload: TsiIntegrationErrorsRequest): Observable<TsiIntegrationErrorsResponse> {
    return this.httpService.get('/api/tsi/v1/TSIIntegrationErrors', payload );
  }
}
