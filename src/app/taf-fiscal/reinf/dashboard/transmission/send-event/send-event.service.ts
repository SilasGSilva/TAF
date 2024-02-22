import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { SendResponse } from '../../../../models/send-response';
import { PayloadEventsReinf } from '../../../../../models/payload-events-reinf';
import { ItemsToTransmission } from 'taf-fiscal/models/transmission-items';
import { ItemsToUndelete } from 'taf-fiscal/models/undelete-items';
import { PayloadUndeleteReinf } from '../../../../../models/payload-undelete-reinf';
import { EventDeleteResponse } from './../../../../../models/event-delete-response';

@Injectable({
  providedIn: 'root',
})
export class SendEventService {
  constructor(private httpService: HttpService) {}

  public send(
    payload: ItemsToTransmission,
    params: PayloadEventsReinf
  ): Observable<SendResponse> {
    return this.httpService.post('/wstaf004/transmitionReinf', payload, params);
  }

  public undelete(
    payload: ItemsToUndelete,
    params: PayloadUndeleteReinf
  ): Observable<{undeletedDetail: Array<EventDeleteResponse>}> {
    return this.httpService.post('/wstaf004/undelete', payload, params);
  }
}