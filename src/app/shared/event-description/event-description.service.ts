import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EventDescriptionResponse } from '../../models/event-description-response';
import { EventDescription } from '../../models/event-description';
import { HttpService } from 'core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EventDescriptionService {

  constructor(private httpService: HttpService) { }

  public getDescription(payload: EventDescription): Observable<EventDescriptionResponse> {
    return this.httpService.get('/wstaf003/eventDescription', payload);
  }
}
