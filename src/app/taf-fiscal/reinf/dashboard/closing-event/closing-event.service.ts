import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { ClosingEventResponse } from '../../../models/closing-event-response';
import { ClosingQueryingResponse } from '../../../../models/closing-querying-response';
import { PayloadEventsReinf } from '../../../../models/payload-events-reinf';

@Injectable({
    providedIn: 'root'
})

export class ClosingEventService {

  constructor(private http: HttpService) { }

  public closingEvent(params: PayloadEventsReinf): Observable<ClosingEventResponse> {
    return this.http.post('/wstaf002/apurReinf', {}, params);
  }

  public queryingClosedEvent(params: PayloadEventsReinf): Observable<ClosingQueryingResponse> {
      return this.http.get('/wstaf005/monitoring', params);
  }
}
