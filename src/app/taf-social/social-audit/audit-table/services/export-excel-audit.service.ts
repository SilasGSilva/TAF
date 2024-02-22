import { Injectable } from '@angular/core';
import { PoI18nPipe } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { DownloadService } from './../../../../shared/download/download.service';
import { HttpService } from './../../../../core/services/http.service';
import { AuditValuesRequest } from './../../social-audit-models/AuditValuesRequest';
import { AuditValuesResponse } from './../../social-audit-models/AuditValuesResponse';

@Injectable()
export class ExportExcelAuditService {
  private literals: Object = {};

  constructor(
    private httpService: HttpService,
    private downloadService: DownloadService,
    private poI18n: PoI18nPipe,
    private literalService: LiteralService
  ) {
    this.literals = this.literalService.literalsTafSocial;
  }

  public async exportToFile(params): Promise<void> {
    const infoParams = Object.assign(params, { page: 1, pageSize: 1000 });
    const header: Array<String> = this.header();
    const items: Array<Object> = [];
    let hasNextValues: boolean = true;

    while (hasNextValues) {
      await this.getValuesAudit(infoParams).then(response => {
        response.items.forEach(item => {
          items.push([
            item.branch,
            item.eventDescription,
            item.typeOrigin,
            item.indApur,
            item.periodEvent,
            item.cpf,
            item.registration,
            item.name,
            item.dateTrans,
            item.deadline,
            item.receipt,
            item.ruleDescription,
            item.deadlineDescription
          ]);
        });
        hasNextValues = response.hasNext;
        infoParams.page++;
      }, (error) => {
        throw Error(error);
      });
    }

    this.downloadService.download(
      this.poI18n.transform(this.literals['auditEsocial']['filename'], [infoParams.requestId]),
      this.literals['auditEsocial']['auditResult'],
      header,
      items
    );
  }

  public getValuesAudit(payload: AuditValuesRequest): Promise<AuditValuesResponse> {
    return this.httpService.getAsync('/api/rh/esocial/v1/EsocialAudit/auditValues', payload);
  }

  private header(): Array<String> {
    return [
      this.literals['auditEsocial']['branch'],
      this.literals['auditEsocial']['event'],
      this.literals['auditEsocial']['type'],
      this.literals['auditEsocial']['indApur'],
      this.literals['auditEsocial']['eventDate'],
      this.literals['auditEsocial']['cpf'],
      this.literals['auditEsocial']['registration'],
      this.literals['auditEsocial']['name'],
      this.literals['auditEsocial']['transmissionDate'],
      this.literals['auditEsocial']['transmissionDeadline'],
      this.literals['auditEsocial']['receipt'],
      this.literals['auditEsocial']['ruleDescription'],
      this.literals['auditEsocial']['deadlineDescription']
    ];
  }
}

