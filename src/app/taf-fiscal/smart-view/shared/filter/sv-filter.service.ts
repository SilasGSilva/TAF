import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http.service';
import { SvBusinessObjectListing } from '../../models/sv-business-object-listing';
import { SvBusinessObjectListingResponse } from '../../models/sv-business-object-listing-response';
import { SmartViewConfiguredListing } from '../../models/sv-configured-listing';
import { SmartViewConfiguredResponse } from '../../models/sv-configured-response';

@Injectable({
  providedIn: 'root'
})
export class SmartViewFilterService {
  constructor(
    protected injector: Injector,
    private http: HttpService
  ) {}

  public getEventListing(payload: SvBusinessObjectListing): Observable<SvBusinessObjectListingResponse> {
    return this.http.get('/api/tsi/v1/TAFSmartView/getBusinessObject', payload);
  }

  public getSmartViewConfiguredListing(params: SmartViewConfiguredListing): Observable<SmartViewConfiguredResponse> {
    return this.http.get('/api/tsi/v1/TAFSmartView/getConfigured', params);
  }
}