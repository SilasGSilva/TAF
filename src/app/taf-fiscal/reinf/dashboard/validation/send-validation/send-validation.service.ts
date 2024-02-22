import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { SendValidationResponse } from '../../../../models/send-validation-response';
import { SendValidation } from '../../../../models/send-validation';
import { PayloadEventsReinf } from '../../../../../models/payload-events-reinf';

@Injectable({
  providedIn: 'root'
})
export class SendValidationService {

  constructor(private httpService: HttpService) { }

  public executePenddingValidation(payload: SendValidation, params: PayloadEventsReinf): Observable<SendValidationResponse> {
    return this.httpService.post('/wstaf002/apurReinf', payload, params);
  }
}
