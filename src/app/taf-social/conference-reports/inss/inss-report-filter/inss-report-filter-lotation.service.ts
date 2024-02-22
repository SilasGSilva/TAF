import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpCacheService } from '../../../../core/services/http-cache.service';
import { LotationRequest } from '../../conference-reports-models/LotatationRequest';
import { LotationResponse } from '../../conference-reports-models/LotationResponse';

@Injectable({
  providedIn: 'root',
})
export class InssReportFilterLotationService extends HttpCacheService<
  LotationRequest,
  LotationResponse
> {
  private tafContext: string = sessionStorage.getItem('TAFContext');

  constructor(protected injector: Injector) {
    super(injector);
  }

  public getListLotations(
    params: LotationRequest,
    page?: number
  ): Observable<LotationResponse> {
    return this.tafContext === 'gpe'
      ? this.get('/api/rh/esocial/v1/GPEEsocialLotation', params, page)
      : this.get('/api/rh/esocial/v1/EsocialLotation', params, page);
  }
}
