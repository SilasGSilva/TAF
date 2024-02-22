import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { EventError } from '../../models/event-error';
import { EventErrorsMessageResponse } from '../../models/event-errors-message-response';

@Injectable({
  providedIn: 'root'
})
export class EventErrorMessageService {

  constructor(private http: HttpService) { }

  public getMsgErrorGov(payload: EventError): Observable<EventErrorsMessageResponse> {
    return this.http.get('/wstaf005/MsErrorGov' , payload);
  }

}
