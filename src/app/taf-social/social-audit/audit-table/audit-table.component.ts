import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { PoTableColumn, PoTableColumnSort, PoModalComponent, PoModalAction } from '@po-ui/ng-components';
import { Audit } from './../social-audit-models/Audit';
import { AuditValuesResponse } from '../social-audit-models/AuditValuesResponse';
import { LiteralService } from 'core/i18n/literal.service';
import { CheckFeaturesService } from './../../../shared/check-features/check-features.service';
import { ExportExcelAuditService } from './services/export-excel-audit.service';
import { AuditService } from './../audit-filter/services/audit.service';
import { MessengerComponent } from './../../../shared/messenger/messenger.component';

@Component({
  selector: 'app-audit-table',
  templateUrl: './audit-table.component.html',
  styleUrls: ['./audit-table.component.scss']
})
export class AuditTableComponent implements OnInit {
  @Input() itemsTable: Array<AuditValuesResponse>;
  @Input() loadingTable: boolean = false;
  @Input() hasNext: boolean = false;
  @Input() filterStatus: string = '';
  @Output('showMore') showMore = new EventEmitter();
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;
  @ViewChild(MessengerComponent, { static: true })

  public isLoadingButton: boolean = false;
  public literals: Object = {};
  public filter: string = '';
  public columns: Array<PoTableColumn>;
  public debounce: Subject<string> = new Subject<string>();
  public currentParams: any;
  public sub: Subscription;
  public messengerModal: MessengerComponent;
  public colorTag: string;
  public colorTagRGB: string;
  public modalTitle: string;
  public primaryAction: PoModalAction;
  public branch: string;
  public event: string;
  public type: string;
  public indApur: string;
  public eventDate: string;
  public cpf: string;
  public registration: string;
  public name: string;
  public transmissionDate: string;
  public transmissionDeadline: string;
  public receipt: string;
  public status: string;
  public ruleDescription: string;
  public deadlineDescription: string;
  public transmissionObservation: string;
  public establishment: string;
  public processNumber: string;
  public loadingShowMore: boolean = false;
  private legendInfo: Array<Object>;

  constructor(
    private literalsService: LiteralService,
    private checkFeatureService: CheckFeaturesService,
    private auditService: AuditService,
    private exportExcelAuditService: ExportExcelAuditService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.legendInfo = this.getLegendInfo();
    this.columns = this.getColumns();
    this.primaryAction = {
      action: () => this.poModal.close(),
      label: this.literals['auditEsocial']['close'],
    };
    this.sub = this.auditService.getCurrentParams().subscribe(params => {
      this.currentParams = params;
    });

    this.debounce
    .pipe(debounceTime(300))
    .subscribe(filter => (this.filter = filter));
  }

  public showMoreRegisters(sortColumn: PoTableColumnSort): void {
    this.showMore.emit(!this.hasNext);
    this.loadingShowMore = true;
    this.sortColumnDetail(sortColumn);
  }

  public async exportData(): Promise<void> {
    const featuresReturn = this.checkFeatureService.getFeature('downloadXLS');

    if (this.filterStatus) {
      this.currentParams = Object.assign(this.currentParams, { status: this.filterStatus })
    } else {
      delete this.currentParams.status;
    }

    if (featuresReturn.access) {
      this.isLoadingButton = true;
      await this.exportExcelAuditService.exportToFile(this.currentParams);
      this.isLoadingButton = false;
    } else {
      this.messengerModal.onShowMessage(
        featuresReturn.message,
        false,
        false,
        this.literals['systemInfos']['unupdatedSystem']
      );
    }
  }

  private getColumns(): Array<PoTableColumn> {
    const columnsAudit = [];

    columnsAudit.push({
      property: 'status',
      type: 'subtitle',
      subtitles: this.getSubtitles(this.legendInfo)
    });
    columnsAudit.push({
      property: 'branch',
      label: this.literals['auditEsocial']['branch'],
    });
    columnsAudit.push({
      property: 'eventDescription',
      label: this.literals['auditEsocial']['event'],
      type: 'link',
      action: (value, row) => {
        this.modalValues(value, row);
      },
    });
    columnsAudit.push({
      property: 'typeOrigin',
      visible: false,
      label: this.literals['auditEsocial']['type'],
    });
    columnsAudit.push({
      property: 'indApur',
      visible: false,
      label: this.literals['auditEsocial']['indApur'],
      type: 'number',
    });
    columnsAudit.push({
      property: 'periodEvent',
      label: this.literals['auditEsocial']['eventDate'],
      type: 'string',
    });
    columnsAudit.push({
      property: 'cpf',
      label: this.literals['auditEsocial']['cpf'],
    });
    columnsAudit.push({
      property: 'registration',
      visible: false,
      label: this.literals['auditEsocial']['registration'],
    });
    columnsAudit.push({
      property: 'name',
      label: this.literals['auditEsocial']['name'],
    });
    columnsAudit.push({
      property: 'dateTrans',
      label: this.literals['auditEsocial']['transmissionDate'],
      type: 'string',
    });
    columnsAudit.push({
      property: 'deadline',
      label: this.literals['auditEsocial']['transmissionDeadline'],
      type: 'string',
    });
    columnsAudit.push({
      property: 'receipt',
      visible: false,
      label: this.literals['auditEsocial']['receipt'],
    });
    columnsAudit.push({
      property: 'ruleDescription',
      visible: false,
      label: this.literals['auditEsocial']['ruleDescription'],
    });
    columnsAudit.push({
      property: 'deadlineDescription',
      visible: false,
      label: this.literals['auditEsocial']['deadlineDescription'],
    });
    columnsAudit.push({
      property: 'transmissionObservation',
      visible: false,
      label: this.literals['auditEsocial']['transmissionObservation'],
    });
    columnsAudit.push({
      property: 'establishment',
      visible: false,
      label: this.literals['auditEsocial']['establishment'],
    });
    columnsAudit.push({
      property: 'processNumber',
      visible: false,
      label: this.literals['auditEsocial']['processNumber'],
    });

    return columnsAudit;
  }

  private modalValues(value: string, row: Audit): void {
    this.modalTitle = this.literals['auditEsocial']['auditDetail'];
    this.name = value;
    this.status = this.legendInfo.filter(el => el['code'] == row.status)[0]['description'].toUpperCase()
    this.colorTag = this.legendInfo.filter(el => el['code'] == row.status)[0]['color'];
    this.colorTagRGB = this.legendInfo.filter(el => el['code'] == row.status)[0]['colorRGB'];
    this.transmissionDate = row.dateTrans;
    this.transmissionDeadline = row.deadline;
    this.event = row.eventDescription;
    this.indApur = row.indApur;
    this.eventDate = row.periodEvent;
    this.type = row.typeOrigin;
    this.receipt = row.receipt;
    this.branch = row.branch;
    this.cpf = row.cpf;
    this.registration = row.registration;
    this.name = row.name;
    this.ruleDescription = row.ruleDescription;
    this.deadlineDescription = row.deadlineDescription;
    this.transmissionObservation = row.transmissionObservation;
    this.establishment = row.establishment;
    this.processNumber = row.processNumber;

    this.poModal.open();
  }

  private getSubtitles(legendInfo: Array<Object>): Array<Object>{
    const items: Array<Object> = [];

    legendInfo.forEach(el => items.push({
      value: el['code'],
      color: el['color'],
      label: el['description'],
      content: el['content']
    }))

    return items
  }

  private getLegendInfo(): Array<Object>{
    return [
      {
        code: '1',
        color: 'color-10',
        description: this.literals['auditEsocial']['transmittedWithinTheTimeLimit'],
        content: '',
        colorRGB: 'rgb(86, 185, 107)'
      },
      {
        code: '2',
        color: 'color-07',
        description: this.literals['auditEsocial']['transmittedOutOfTime'],
        content: '',
        colorRGB: 'rgb(198, 72, 64)'
      },
      {
        code: '3',
        color: 'color-02',
        description: this.literals['auditEsocial']['notTransmittedWithinTheTimeLimit'],
        content: '',
        colorRGB: 'rgb(44, 133, 200)'
      },
      {
        code: '4',
        color: 'color-08',
        description: this.literals['auditEsocial']['notTransmittedOutOfTime'],
        content: '',
        colorRGB: 'rgb(234, 155, 62)'
      },
    ]
  }

  private sortColumnDetail(sortColumn: PoTableColumnSort): void {
    if (sortColumn) {
      this.itemsTable.sort((a, b) => {
        if (sortColumn.type === 'ascending') {
          return a[sortColumn.column.property] < b[sortColumn.column.property] ? -1 : 0;
        }

        return a[sortColumn.column.property] > b[sortColumn.column.property] ? -1 : 0;
      });
    }
  }
}
