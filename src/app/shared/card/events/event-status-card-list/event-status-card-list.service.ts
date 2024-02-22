import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { CardListResponse } from '../../../../models/event-status-card-list-response';
import { ClosingQueryingResponse } from '../../../../models/closing-querying-response';
import { PayloadEventsReinf } from '../../../../models/payload-events-reinf';

@Injectable({
    providedIn: 'root'
})
export class CardListService {
    constructor(private http: HttpService) { }

  public getList(payload: PayloadEventsReinf): Observable<CardListResponse> {
        return this.http.get('/wstaf005/statusTransmission', payload);
    }

  public queryingClosedEvent(params: PayloadEventsReinf): Observable<ClosingQueryingResponse> {
        return this.http.get('/wstaf005/monitoring', params);
    }
}
