import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http.service';
import { TsiDivergentDocumentsReinstateRequest } from '../models/tsi-divergent-documents-reinstate-request';
import { TsiDivergentDocumentsReinstateResponse } from '../models/tsi-divergent-documents-reinstate-response';

@Injectable({
  providedIn: 'root'
})

export class TsiDivergentDocumentsService {

  constructor(private httpService: HttpService) { }

  public postReinstateInvoices(body:String,param: TsiDivergentDocumentsReinstateRequest): Observable<TsiDivergentDocumentsReinstateResponse> {
    return this.httpService.post('/api/tsi/v1/TSIDivergentDocuments/reinstate',body, param );
  }
}
