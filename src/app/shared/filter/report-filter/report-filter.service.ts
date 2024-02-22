import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { EventListing } from '../../../models/event-listing';
import { EventListingResponse } from '../../../models/event-listing-response';
import { ReportListing } from '../../../models/report-listing';
import { ReportListingResponse } from '../../../models/report-listing-response';
import { ReportReinfEventsRequest } from './../../../models/report-reinf-events-request';
import { ReportReinfEventsResponse } from './../../../models/report-reinf-events-response';

@Injectable({
    providedIn: 'root'
  })

export class ReportFilterService {

    public inputPeriod: string;
    public inputGroup: number = 1;

    constructor(private httpService: HttpService) { }

    public getEventListing(payload: EventListing): Observable<EventListingResponse> {
        return this.httpService.get('/wstaf001', payload );
    }

    public getReportListing(payload: ReportListing): Observable<ReportListingResponse> {
      return this.httpService.post('/wstaf002/eventDetail', {}, payload);
    }

    public setInputPeriod(inputPeriod: string): void {
        window.localStorage.setItem('period', inputPeriod);
        this.inputPeriod = inputPeriod;
    }

    public getInputPeriod(): string {
        return window.localStorage.getItem('period') ? window.localStorage.getItem('period') : this.inputPeriod;
    }


    public setInputGroupMonitor(inputGroup: number): void {
      window.localStorage.setItem('taf_group_type_report', inputGroup.toString());
      this.inputGroup = inputGroup;
    }

    public getInputGroupMonitor(): number {
      var sessionGroup: string = window.localStorage.getItem('taf_group_type_report');
      var groupType: number = this.inputGroup;

      if(sessionGroup == null || sessionGroup == "null") {
        groupType = 1;
      } else {
        groupType = parseInt(sessionGroup);
      }
      return groupType ? groupType : this.inputGroup;
    }

    public getReinfEvents(params:ReportReinfEventsRequest): Observable<ReportReinfEventsResponse>{
      return this.httpService.get('/api/taf/reinf/v1/reinfEvents',params);
    }
}
