import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PoChartSerie, PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { AuditValuesRequest } from './../social-audit-models/AuditValuesRequest';
import { Audit } from '../social-audit-models/Audit';
import { LiteralService } from 'core/i18n/literal.service';
import { AuditService } from './../audit-filter/services/audit.service';

@Component({
  selector: 'app-audit-chart',
  templateUrl: './audit-chart.component.html'
})
export class AuditChartComponent implements OnInit {
  @Input() chartInfo: Array<PoChartSerie>;
  @Input() title: string;
  @Input() chartType: string;
  @Input() loadingTable = false;
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  public primaryAction: PoModalAction;
  public literals: Object = {};
  private page: number = 1;
  public hasNext: boolean = true;
  public showMore: boolean;
  public modalTitle: string;
  public chartSliceTableItems: Array<Audit>;
  public filterStatus: string;
  public chartSliceLabel: string = '';
  private currentParams = {};

  constructor(
    private literalsService: LiteralService,
    private auditService: AuditService,
    private ref: ChangeDetectorRef
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.primaryAction = {
      action: () => this.poModal.close(),
      label: this.literals['auditEsocial']['close'],
    };

    this.auditService.getCurrentParams().subscribe( params => {
      this.currentParams = params
    });
  }

  public prepareModal(event: any): void {
    this.modalTitle = `${this.literals['auditEsocial']['events'].toUpperCase()} ${event.label.toUpperCase()}`;
    this.chartSliceLabel = event.label;
    this.page = 1;
    this.loadingTable = true;
    this.chartSliceTableItems = [];

    const request = this.changeParamsChartSlice(
      this.currentParams['companyId'],
      this.currentParams['requestId'],
      this.chartSliceLabel);

    this.auditService.getValuesAudit(request).subscribe(response => {
      this.chartSliceTableItems = response.items;
      this.filterStatus = request.status;
      this.hasNext = !response.hasNext;
      this.showMore = undefined;
      this.loadingTable = false;
      this.ref.detectChanges();
    });

    this.poModal.open();
  }

  private changeParamsChartSlice(companyId: string, requestId: string, chartSliceLabel: string): AuditValuesRequest {
    let chartSliceCodeOption: string = '';

    switch (chartSliceLabel) {
      case this.literals['auditEsocial']['transmittedAndAcceptedByTheGovernment']:
        chartSliceCodeOption = "1','2"
        break;
      case this.literals['auditEsocial']['pendingTransmissionToTheGovernment']:
        chartSliceCodeOption = "3','4"
        break;
      case this.literals['auditEsocial']['transmittedWithinTheTimeLimit']:
        chartSliceCodeOption = '1'
        break;
      case this.literals['auditEsocial']['transmittedOutOfTime']:
        chartSliceCodeOption = '2'
        break;
      case this.literals['auditEsocial']['notTransmittedWithinTheTimeLimit']:
        chartSliceCodeOption = '3'
        break;
      case this.literals['auditEsocial']['notTransmittedOutOfTime']:
        chartSliceCodeOption = '4'
        break;
    }

    const params = {
      companyId: companyId,
      requestId: requestId,
      page: this.page++,
      pageSize: 20,
      status: chartSliceCodeOption
    };

    return params;
  }

  public showMoreRegisters(showMore: boolean): void {
    if (showMore) {
      const request = this.changeParamsChartSlice(
        this.currentParams['companyId'],
        this.currentParams['requestId'],
        this.chartSliceLabel
      );

      this.auditService.getValuesAudit(request).subscribe(response => {
        response.items.forEach(element => {
          this.chartSliceTableItems.push(element);
        });
        this.chartSliceTableItems = [...this.chartSliceTableItems];
        this.hasNext = !response.hasNext;
        this.showMore = undefined;
      });
    }
  }
}
