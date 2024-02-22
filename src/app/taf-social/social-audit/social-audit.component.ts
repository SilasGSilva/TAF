import { Component } from '@angular/core';
import { LiteralService } from 'core/i18n/literal.service';
import { AuditChartSeriesResponse } from './social-audit-models/AuditChartSeriesResponse';
import { AuditValuesResponse } from './social-audit-models/AuditValuesResponse';

@Component({
  selector: 'app-social-audit',
  templateUrl: './social-audit.component.html',
  styleUrls: ['./social-audit.component.scss']
})
export class SocialAuditComponent {
  public disabledInputs = false;
  public loadingTable = false;
  public progressBarValue = 0;
  public progressBarInfo = '';
  public progressSuccess = false;
  public emptyResult = false;
  public verifyRegisters = false;
  public showMore = false;
  public hasNext = false;
  public literals = {};
  public itemsTable = [];
  public disableButtonApplyFilters = true;
  public chartTransmissionInfo: Array<Object> = null;
  public chartComplianceInfo: Array<Object> = null;

  constructor(
    private literalsService: LiteralService,
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  public loadProgressBar(progressBarValue: number): void {
    if (progressBarValue < 100) {
      this.disabledInputs = true;
      this.loadingTable = true;
      this.progressBarValue = progressBarValue;
      this.progressBarInfo = `${this.progressBarValue}%`;
    } else {
      this.disabledInputs = false;
      this.loadingTable = false;
      this.progressBarValue = progressBarValue;
      this.progressBarInfo = `${this.progressBarValue}%`;
      this.progressSuccess = true;
    }
  }

  public loadChartSeries(payloadAuditChart: AuditChartSeriesResponse): void {
    const transmitted = payloadAuditChart.transmOutDeadline + payloadAuditChart.transmInDeadline;
    const notTransmitted = payloadAuditChart.notTransmOutDeadline + payloadAuditChart.notTransmInDeadline;

    this.chartTransmissionInfo = [
      {
        label: this.literals['auditEsocial']['transmittedAndAcceptedByTheGovernment'],
        data: transmitted,
        tooltip: `${this.literals['auditEsocial']['eventsTransmittedAndAcceptedByTheGovernment']} : ${transmitted}`,
        color: 'rgb(86, 185, 107)'
      },
      {
        label: this.literals['auditEsocial']['pendingTransmissionToTheGovernment'],
        data: notTransmitted,
        tooltip: `${this.literals['auditEsocial']['pendingEventsOfTransmissionToTheGovernment']} : ${notTransmitted}`,
        color: 'rgb(198, 72, 64)'
      },
    ];

    this.chartComplianceInfo = [
      {
        label: this.literals['auditEsocial']['transmittedWithinTheTimeLimit'],
        data: payloadAuditChart.transmInDeadline,
        tooltip: `${this.literals['auditEsocial']['transmittedAndOnTime']} : ${payloadAuditChart.transmInDeadline}`,
        color: 'rgb(86, 185, 107)'
      },
      {
        label: this.literals['auditEsocial']['transmittedOutOfTime'],
        data: payloadAuditChart.transmOutDeadline,
        tooltip: `${this.literals['auditEsocial']['transmittedButOutOfTime']} : ${payloadAuditChart.transmOutDeadline}`,
        color: 'rgb(198, 72, 64)'
      },
      { label: this.literals['auditEsocial']['notTransmittedWithinTheTimeLimit'],
        data: payloadAuditChart.notTransmInDeadline,
        tooltip: `${this.literals['auditEsocial']['notTransmittedButOnTime']} : ${payloadAuditChart.notTransmInDeadline}`,
        color: 'rgb(44, 133, 200)'
      },
      {
        label: this.literals['auditEsocial']['notTransmittedOutOfTime'],
        data: payloadAuditChart.notTransmOutDeadline,
        tooltip: `${this.literals['auditEsocial']['notTransmittedAndOutOfTime']} : ${payloadAuditChart.notTransmOutDeadline}`,
        color: 'rgb(234, 155, 62)'
      }
    ];
  }

  public loadMainTable(payloadReportTable: AuditValuesResponse): void {
    if (this.itemsTable == undefined) {
      this.itemsTable = payloadReportTable.items;
    } else {
      payloadReportTable.items.forEach(element => {
        this.itemsTable.push(element);
      });
    }

    this.verifyRegisters = true;
    this.showMore = undefined;
    this.hasNext = !payloadReportTable.hasNext;
    this.itemsTable = [...this.itemsTable];
    this.progressBarValue = undefined;

    if (this.itemsTable.length == 0) {
      this.emptyResult = true;
      this.verifyRegisters = false;
    }
  }

  public reset(): void {
    this.progressBarValue = undefined;
    this.progressSuccess = undefined;
    this.itemsTable = undefined;
    this.verifyRegisters = false;
    this.emptyResult = false;
  }

  public showMoreRegisters(showMore: boolean): void {
    this.showMore = showMore;
  }
}
