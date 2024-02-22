import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { EventMonitor } from '../../../../models/event-monitor';
import { ItemTableMonitor } from '../../../../models/item-table-monitor';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableEventByTheSportsAssociation } from '../../../../models/item-table-event-by-the-sports-association';
import { ItemTableTaxPayer } from './item-table-tax-payer';
import { ItemTableSociaSecurityContribution } from './item-table-socia-security-contribution';
import { ItemTableResourcesReceivedByTheSportsAssociation } from './item-table-resources-received-by-the-sports-association';

@Injectable({
  providedIn: 'root'
})
export class EventMonitorTableService {

  constructor(private http: HttpService) { }

  public getInfoEventMonitor(payload: EventMonitor): Observable<{
    eventDetail: Array<ItemTableMonitor
      | ItemTableTaxPayer
      | ItemTableProcess
      | ItemTableMarketingByFarmer
      | ItemTableSociaSecurityContribution
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTableEventByTheSportsAssociation>}> {
    return this.http.get('/wstaf005/detailStatusTransmission', payload);
  }
}
