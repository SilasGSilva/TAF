import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { ItemTableValidation } from '../../../models/item-table-validation';
import { ItemTableSpecificEvent } from '../../../models/item-table-specific-event';
import { ItemTableProcess } from '../../../models/item-table-process';
import { ItemTableMarketingByFarmer } from '../../../models/item-table-marketing-by-farmer';
import { ItemTableSocialSecurityContributionValidation } from '../../../models/item-table-social-security-contribution-validation';
import { PayloadEventsReinf } from '../../../../models/payload-events-reinf';

@Injectable({
  providedIn: 'root',
})
export class ReportValidationTableService {
  constructor(private httpService: HttpService) { }

  public getInfoValidationPending(
    payload: PayloadEventsReinf
  ): Observable<{
    eventDetail: Array<
    | ItemTableValidation
    | ItemTableSpecificEvent
    | ItemTableProcess
    | ItemTableMarketingByFarmer
    | ItemTableSocialSecurityContributionValidation
    >
    ,hasNext: boolean;
  }> {
    return this.httpService.post('/wstaf002/eventDetail', {}, payload);
  }
}
