import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http.service';
import { TsiDivergentDocumentsRequest } from '../../models/tsi-divergent-documents-request';
import { TsiDivergentDocumentsResponse } from '../../models/tsi-divergent-documents-response';

@Injectable({
  providedIn: 'root'
})
export class TsiDivergentDocumentsTableService {

  constructor(private httpService: HttpService) { }

  public getTsiDivergentDocuments(payload: TsiDivergentDocumentsRequest): Observable<TsiDivergentDocumentsResponse> {
    return this.httpService.get('/api/tsi/v1/TSIDivergentDocuments', payload );
  }

}
