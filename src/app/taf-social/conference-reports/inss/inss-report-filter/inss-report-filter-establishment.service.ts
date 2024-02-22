import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCacheService } from '../../../../core/services/http-cache.service';
import { EstablishmentRequest } from '../../conference-reports-models/EstablishmentRequest';
import { EstablishmentResponse } from '../../conference-reports-models/EstablishmentResponse';

@Injectable({
  providedIn: 'root',
})
export class EstablishmentReportFilterService extends HttpCacheService<
  EstablishmentRequest,
  EstablishmentResponse
> {
  private tafContext: string = sessionStorage.getItem('TAFContext');

  constructor(protected injector: Injector) {
    super(injector);
  }

  public getListEstablishment(
    params: EstablishmentRequest,
    page?: number
  ): Observable<EstablishmentResponse> {
    if (this.tafContext === 'gpe') {
      return this.get(
        '/api/rh/esocial/v1/GPEEsocialEstablishment',
        params,
        page
      );
    } else {
      return this.get('/api/rh/esocial/v1/EsocialEstablishment', params, page);
    }
  }
}
