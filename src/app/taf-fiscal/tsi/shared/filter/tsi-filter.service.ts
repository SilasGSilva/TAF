import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http.service';
import { HttpCacheService } from 'core/services/http-cache.service';
import { TsiBranchesListingResponse } from './../../models/tsi-branches-listing-response';
import { TsiBranchesListing } from './../../models/tsi-branches-listing';


@Injectable({
  providedIn: 'root'
})
export class TsiFilterService extends HttpCacheService<TsiBranchesListing,TsiBranchesListingResponse> {
  constructor(protected injector: Injector,private http: HttpService) {
    super(injector);
  }
  public getEventListing(payload: TsiBranchesListing): Observable<TsiBranchesListingResponse> {
    return this.get('/api/tsi/v1/TsiBranches', payload );
  }
}