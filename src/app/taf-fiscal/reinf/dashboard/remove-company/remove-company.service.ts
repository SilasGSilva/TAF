import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http.service';

import { ReinfRemoveCompanyListing } from './../../../../models/reinf-remove-company-listing';
import { ReinfRemoveCompanyResponse } from './../../../../models/reinf-remove-company-response';

@Injectable({
  providedIn: 'root'
})

export class RemoveCompanyService {
  constructor(private httpService: HttpService) {}

public send( params: ReinfRemoveCompanyListing ): Observable<ReinfRemoveCompanyResponse> {
  return this.httpService.post('/api/reinf/v1/reinfContributor/removeCompany', {}, params );
}

}
