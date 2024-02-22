import { Injectable } from '@angular/core';
import { LiteralService } from 'core/i18n/literal.service';
import { HttpService } from 'core/services/http.service';
import { Observable } from 'rxjs';
import { ESocialBaseConferValuesRequest } from '../../../conference-reports-models/ESocialBaseConferValuesRequest';
import { ESocialBaseConferInssValuesResponse } from '../../../conference-reports-models/ESocialBaseConferInssValuesResponse';

@Injectable({
  providedIn: 'root',
})
export class InssReportTableService {
  literals = {};

  constructor(
    private http: HttpService,
    private literalsService: LiteralService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  public getReportModal(
    params: ESocialBaseConferValuesRequest,
    menuContext: string
  ): Observable<ESocialBaseConferInssValuesResponse> {
    if (menuContext === 'gpe') {
      return this.http.get(
        '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/InssValues',
        params
      );
    } else {
      return this.http.get(
        '/api/rh/esocial/v1/reportEsocialBaseConfer/InssValues',
        params
      );
    }
  }
}
