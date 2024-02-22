import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { EventDeleteResponse } from '../../../../models/event-delete-response';
import { PayloadDeleteEvent } from '../../../../models/payload-delete-event';
import { ItemsToDeletion } from 'taf-fiscal/models/delete-items';

@Injectable({
    providedIn: 'root'
})

export class EventMonitorService {

  constructor(private http: HttpService) { }

  public deleteEvent(
    payload: ItemsToDeletion,
    params: PayloadDeleteEvent): Observable<{deletedDetail: Array<EventDeleteResponse>}> {
      
      return this.http.post('/wstaf004/deleteEvent', payload, params);
  }

}
