
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { ExportReport } from '../../../models/export-report';
import { ExportReportResponse2030and2040 } from 'taf-fiscal/models/export-response-2030-2040';
import { ExportReportResponse } from 'taf-fiscal/models/export-report-response';
import { ExportReportResponse2050 } from 'taf-fiscal/models/export-response-2050';
import { ExportReportResponse2055 } from 'taf-fiscal/models/export-response-2055';
import { ExportReportSocialSecurityContribution } from 'taf-fiscal/models/export-report-social-security-contribution';
import { ExportReportResponse5001 } from 'taf-fiscal/models/export-response-5001';
import { ExportReportResponse5011 } from 'taf-fiscal/models/export-response-5011';
import { ExportXmlResponse } from './../../../models/export-xml-response';

@Injectable({
  providedIn: 'root',
})
export class ExportReportService {

  constructor(
    private httpService: HttpService
  ) { }

  public getReport(
    payload: ExportReport
  ): Observable<{
    eventDetail:
    Array<
      ExportReportResponse
      | ExportReportResponse2030and2040
      | ExportReportResponse2050
      | ExportReportResponse2055
      | ExportReportResponse5001
      | ExportReportResponse5011
      | ExportReportSocialSecurityContribution
    >;
  }> {
    return this.httpService.get('/wstaf017/eventDetail', payload);
  }

  public postExportXML(params: ExportReport): Observable<ExportXmlResponse> {
    return this.httpService.post('/api/taf/reinf/v1/exportXML', {} , params);
  }
}
