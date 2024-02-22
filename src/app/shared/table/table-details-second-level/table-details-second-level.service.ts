import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { PayloadTableDetailsSecondLevel } from './payload-table-details-second-level';
import { ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-second-resources-passed-on-the-by-the-sports-association';
import { ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-second-resources-received-by-the-sports-association';

@Injectable({
  providedIn: 'root'
})
export class TableDetailsSecondLevelService {

  constructor(private httpService: HttpService) { }

  public getDetails(payload: PayloadTableDetailsSecondLevel, path: string): Observable<{
    tax: Array<ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation
    | ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation>}> {
      if (path.match(/validation|eventsReport/)) {
        return this.httpService.get('/wstaf002/taxDetail', payload);
      } else if (path === 'transmission') {
        return this.httpService.get('/wstaf004/taxDetail', payload);
      }
    }
}
