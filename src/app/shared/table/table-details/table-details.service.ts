import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { ItemTableDetails } from 'taf-fiscal/models/item-table-details';
import { ItemTableDetailsResourcesReceivedByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-resources-received-by-the-sports-association';
import { ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-resources-passed-on-the-by-the-sports-association';
import { ItemTableDetailsMarketingByFarmer } from 'taf-fiscal/models/item-table-details-marketing-by-farmer';
import { ItemTableDetailsSocialSecurityContributionValidation } from 'taf-fiscal/models/item-table-details-social-security-contribution-validation';
import { ItemTableDetailsProcess } from 'taf-fiscal/models/item-table-details-process';
import { ItemTableDetailsEventByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-event-by-the-sports-association';
import { ItemTableDetailsPaymentsOrCreditsToLegalEntityBeneficiary } from 'taf-fiscal/models/item-table-details-payments-or-credits-to-legal-entity-beneficiary';
import { ItemTableDetailsPayamentCreditPhysicalBeneficiary } from 'taf-fiscal/models/item-table-details-payments-credits-physical-beneficiary-validation';
import { ItemTableDetailsPaymentsOrCreditsToUnidentifiedBeneficiary } from 'taf-fiscal/models/item-table-details-payments-or-credits-to-unidentified-beneficiary';
import { PayloadTableDetails } from '../../../models/payload-table-details';

@Injectable({
    providedIn: 'root'
})

export class TableDetailsService {
    constructor(private httpService: HttpService) { }

  public getDetails(payload: PayloadTableDetails, path: string): Observable<ItemTableDetails | ItemTableDetailsResourcesReceivedByTheSportsAssociation | ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation | ItemTableDetailsMarketingByFarmer | ItemTableDetailsSocialSecurityContributionValidation | ItemTableDetailsProcess | ItemTableDetailsEventByTheSportsAssociation | ItemTableDetailsPaymentsOrCreditsToLegalEntityBeneficiary | ItemTableDetailsPayamentCreditPhysicalBeneficiary | ItemTableDetailsPaymentsOrCreditsToUnidentifiedBeneficiary> {
        if (path === 'transmission') {
            return this.httpService.get('/wstaf004/invoiceDetail', payload);
        } else if (path.match(/validation|eventsReport|/)) {
            return this.httpService.get('/wstaf002/invoiceDetail', payload);
        }
    }
}
