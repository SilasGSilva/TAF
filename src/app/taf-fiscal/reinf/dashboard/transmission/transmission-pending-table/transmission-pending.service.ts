
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { ItemTable } from '../../../../models/item-table';
import { ItemTableSpecificEvent } from '../../../../models/item-table-specific-event';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableRelatedEntity } from '../../../../models/item-table-related-entity';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableSocialSecurityContribution } from '../../../../models/item-table-social-security-contribution';
import { ItemTableResourcesReceivedByTheSportsAssociation } from '../../../../models/item-table-resources-received-by-the-sports-association';
import { ItemTablePaymentsOrCreditsToIndividualBeneficiary } from '../../../../models/item-table-payments-or-credits-to-individual-beneficiary';
import { ItemTablePaymentsOrCreditsToLegalEntityBeneficiary } from '../../../../models/item-table-payments-or-credits-to-legal-entity-beneficiary';
import { ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary } from '../../../../models/item-table-payments-or-credits-to-unidentified-beneficiary';
import { ItemTableReceiptRetention } from '../../../../models/item-table-receipt-retention';
import { PayloadEventsReinf } from '../../../../../models/payload-events-reinf';

@Injectable({
  providedIn: 'root'
})

export class TransmissionPendingService {

  constructor(private httpService: HttpService) { }

  public getInfoTransmissionPending(
    params: PayloadEventsReinf
  ): Observable<{
    eventDetail: Array<
      | ItemTable
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableRelatedEntity
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContribution
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTablePaymentsOrCreditsToIndividualBeneficiary
      | ItemTablePaymentsOrCreditsToLegalEntityBeneficiary
      | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
      | ItemTableReceiptRetention>,
    hasNext: boolean
  }>{
    return this.httpService.get('/wstaf004/eventDetail', params);
  }
}
