import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http.service';
import { Observable } from 'rxjs';
import { TsiReprocessResponse } from '../models/tsi-reprocess-response';
import { TsiReprocessRequest } from '../models/tsi-reprocess-request';

@Injectable({
  providedIn: 'root'
})

export class TsiMonitorService {

  constructor(private httpService: HttpService) { }

  public postReprocessInvoices(body:String,param: TsiReprocessRequest): Observable<TsiReprocessResponse> {
    return this.httpService.post('/api/tsi/v1/TSIIntegrationErrors/reprocessInvoice',body, param );
  }
}
