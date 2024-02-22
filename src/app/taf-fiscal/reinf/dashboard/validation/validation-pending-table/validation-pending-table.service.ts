import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { ItemTableSpecificEvent } from '../../../../models/item-table-specific-event';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableSocialSecurityContributionValidation } from '../../../../models/item-table-social-security-contribution-validation';
import { ItemTableEventByTheSportsAssociation } from '../../../../models/item-table-event-by-the-sports-association';
import { PayloadEventsReinf } from '../../../../../models/payload-events-reinf';
import { PayloadValidationErrors } from '../../../../models/payload-validation-errors';
import { ValidationErrorMessage } from 'taf-fiscal/models/validation-error-message';
import { SendValidationError } from 'taf-fiscal/models/send-validation-error';
import { ItemTableValidation } from 'taf-fiscal/models/item-table-validation';

@Injectable({
  providedIn: 'root'
})

export class ValidationPendingService {

  constructor(private httpService: HttpService) { }

  public getInfoValidationPending(payload: PayloadEventsReinf, body: SendValidationError): Observable<{
    eventDetail: Array<ItemTableSpecificEvent|ItemTableValidation|ItemTableProcess|ItemTableMarketingByFarmer|ItemTableSocialSecurityContributionValidation|ItemTableEventByTheSportsAssociation>,
    hasNext: boolean
   }> {
    return this.httpService.post('/wstaf002/eventDetail', body, payload);
  }

  public getInfoValidationErrorMessage(payload: PayloadValidationErrors): Observable<ValidationErrorMessage> {
    return this.httpService.get('/wstaf002/errorMessageApurReinf', payload);
  }

}
