import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoDialogService,
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSort,
  PoTableComponent,
  PoToolbarAction,
} from '@po-ui/ng-components';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { Md5 } from 'md5-typescript';
import { LiteralService } from '../../../core/i18n/literal.service';
import { MasksPipe } from '../../../shared/pipe/masks.pipe';
import { SocialUserFilterService } from '../../../taf-social/services/social-user-filter/social-user-filter.service';
import { GetXmlEditRequest } from '../../editor-xml/editor-xml-models/GetXmlEditRequest';
import { ColumnProperty } from '../../models/column-property';
import { SocialRemoveCompanyRequest } from '../../services/social-remove-company/social-remove-company-request';
import { SocialRemoveCompanyService } from '../../services/social-remove-company/social-remove-company.service';
import { SocialStatusEnvironmentService } from '../../services/social-status-environment/social-status-environment.service';
import { EventCardItem } from '../monitor-events-cards/EventCardItem';
import { MonitorHeaderActionsComponent } from '../monitor-header-actions/monitor-header-actions.component';
import { EsocialDetailsFilter } from '../social-monitor-models/EsocialDetailsFilter';
import { HeaderEsocialEventDetails } from '../social-monitor-models/HeaderEsocialEventDetails';
import { ItemsEsocialEventDetails } from '../social-monitor-models/ItemsEsocialEventDetails';
import { SocialMonitorService } from '../social-monitor.service';
import { EditorXmlService } from './../../editor-xml/editor-xml.service';
import { eventStatus } from './../social-monitor-models/eventStatus';
import { MonitorDetailService } from './monitor-detail.service';
import { CatReportComponent } from './../../social-cat/cat-report/cat-report.component';

@Component({
  selector: 'app-monitor-detail',
  templateUrl: './monitor-detail.component.html',
  styleUrls: ['./monitor-detail.component.scss'],
})
export class MonitorDetailComponent implements OnInit, DoCheck {
  public pageLink = '/socialMonitor';
  public eventName: string;
  public eventDescription: string;
  public status: string;
  public headerTitle: string;
  public headerLabel: string;
  public textAreaInfo: string;
  public labelTextAreaInfo: string;
  public modalTitle: string;
  public statusMessage: string;
  public period = '';
  public periodTo = '';
  public periodFrom = '';
  public motiveCode: Array<string>;
  public companyId = this.socialMonitorService.getCompany();
  public menuContext = sessionStorage.getItem('TAFContext');
  public labelUpdateEvents = '';
  public isButtonTransmissionDisabled = true;
  public isButtonEditXmlDisabled = true;
  public isButtonPrintCatDisabled = true;
  public isTextAreaReadOnly = true;
  public isCodeEditorReadOnly = false;
  public isEditXml = true;
  public showStatusMessage = false;
  public showPageLoading = false;
  public showTableLoading = false;
  public filter: EsocialDetailsFilter;
  public columnsDetailEvents: Array<PoTableColumn> = [];
  public eventsSelected = [];
  public branches = [];
  public detailFilter = [];
  public itemsDetailEvents: ItemsEsocialEventDetails[];
  public eventCards: Array<EventCardItem> = [];
  public statusOptions = [];
  public literals = {};
  public close: PoModalAction;
  public xmlMessage: string;
  public code: string;
  public hashCode: string;
  public hasNext: boolean;
  public page = 0;
  public pageSize = 100;
  public tableActions: Array<PoTableAction> = [];
  public isDisabled = true;
  public numberInPage: number;
  public total: number;
  public searchValue = '';
  public searchValuePer = '';
  public isTAFFull: boolean;
  public showFilter: boolean;
  public showCounter = true;
  public hideCounter = false;
  public isEvtExc = false;
  public isButtonRemoveCompanyRet = false;
  public isButtonformIssuance = false;
  public isButtonInsertRet = false;
  public isLoadingPrint = false;
  public isCAT: boolean;
  public loadingShowMore = false;
  private layoutEnvironment: string;

  @ViewChild(PoModalComponent, { static: true }) modal: PoModalComponent;
  @ViewChild(PoTableComponent, { static: true }) poTable: PoTableComponent;
  @ViewChild(CatReportComponent, { static: true }) catReport: CatReportComponent;
  @ViewChild(MonitorHeaderActionsComponent, { static: true })
  actionsSend: MonitorHeaderActionsComponent;
  items: ItemsEsocialEventDetails[];

  constructor(
    private literalsService: LiteralService,
    private monitorDetailService: MonitorDetailService,
    private editorXmlService: EditorXmlService,
    private poNotification: PoNotificationService,
    private socialMonitorService: SocialMonitorService,
    private socialStatusEnvironment: SocialStatusEnvironmentService,
    private TAFEsocialRemoveCompany: SocialRemoveCompanyService,
    private masksPipe: MasksPipe,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    public dialogConfirm: PoDialogService,
    private socialUserFilterService: SocialUserFilterService,
    private router: Router
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.getSocialStatusEnvironment();
    this.showTableLoading = true;
    this.getTAFFull();
    this.setStatusOptions();
    this.getRoute();
    this.setHeaderTitle();
    this.setSavedFilters();
    this.loadEventDetails(this.filter);
    this.setTableActions();
    this.setEventsCard();
    this.labelUpdateEvents = this.literals['monitorGeneral']['updateEvents'];
    this.showFilter = this.eventName.match(
      /S-1200|S-1202|S-1207|S-1210|S-2190|S-2200|S-2205|S-2206|S-2210|S-2220|S-2221|S-2230|S-2231|S-2240|S-2241|S-2245|S-2250|S-2260|S-2298|S-2299|S-2300|S-2306|S-2399|S-2400|S-2405|S-2410|S-2416|S-2418|S-2420|S-2500|S-2501|S-3000|S-3500/
    )
      ? true
      : false;
    this.isEvtExc = this.eventName.match(
      /S-3000|S-3500/
    ) 
      ? true
      : false;
    this.isCAT = this.router.url.includes('/monitorDetail') && this.router.url.includes('S-2210');
  }

  ngDoCheck() {
    if (this.socialMonitorService.returnStateMonitor().value) {
      this.updateEventDetails();
      this.isButtonTransmissionDisabled = true;
      this.socialMonitorService.updateMonitor(false);
    }
  }

  public prepareModalError(item: PoToolbarAction): void {
    this.openModalErrorDetail(item['key']);
  }

  public checkError(item: PoToolbarAction): boolean {
    return item['status'] !== eventStatus.REJEITADO ? true : false;
  }

  public checkSent(item: PoToolbarAction): boolean {
    return item['status'] == eventStatus.SUCESSO ? true : false;
  }

  public checkWaiting(item: PoToolbarAction): boolean {
    return item['status'] == eventStatus.AGUARDANDO_RETORNO ? true : false;
  }

  public checkWaitingOrSent(item: PoToolbarAction): boolean {
    return item['status'] == eventStatus.AGUARDANDO_RETORNO ||
      item['status'] == eventStatus.SUCESSO
      ? true
      : false;
  }

  public getPageLink(): string {
    return this.pageLink;
  }

  public getColumns(columns: Array<HeaderEsocialEventDetails>): void {
    const newColumns: Array<HeaderEsocialEventDetails> = [];

    columns.map(column => {
      if (
        !this.columnsDetailEvents.find(
          detailColumn => detailColumn.label === column.label
        )
      ) {
        newColumns.push(column);
      }
    });

    if (newColumns.length > 0) {
      this.columnsDetailEvents = newColumns;
    }
  }

  public setColumns(
    header: Array<HeaderEsocialEventDetails>,
    items: Array<ItemsEsocialEventDetails>
  ): Array<HeaderEsocialEventDetails> {
    this.deleteErrorColumn(header);
    header.forEach(column => {
      if (column.property === 'status') {
        column.type = 'label';
        column.labels = this.statusOptions;
      } else {
        items[0].item.forEach(element => {
          element.columns.forEach(children => {
            if (
              column.property === children.property &&
              children.value.match(
                /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
              )
            ) {
              column.type = 'date';
            }
          });
        });
      }

      column.visible =
        this.getPropertyColumnVisible()[column.label] || column.visible;
    });

    return header;
  }

  public setTableActions(): void {
    this.close = {
      action: () => {
        this.closeModal();
      },
      label: this.literals['monitorGeneral']['close'],
      danger: false,
    };

    this.tableActions = [
      {
        action: this.setUpdate.bind(this),
        icon: 'po-icon-edit',
        disabled: this.checkWaiting.bind(this),
        label: this.literals['monitorGeneral']['update'],
        visible: this.isTAFFull,
      },
      {
        action: this.setDelete.bind(this),
        icon: 'po-icon-delete',
        disabled: this.checkWaiting.bind(this),
        label: this.literals['monitorGeneral']['delete'],
        visible: this.isTAFFull,
      },
      {
        action: this.setView.bind(this),
        icon: 'po-icon-search',
        label: this.literals['monitorGeneral']['view'],
        visible: this.isTAFFull,
      },
      {
        action: this.prepareOpenXmlViewer.bind(this),
        icon: 'po-icon-xml',
        label: this.literals['editorXML']['viewXml'],
        visible: this.isTAFFull,
      },
      {
        action: this.actionsSendTransmit.bind(this),
        icon: 'po-icon-change',
        disabled: this.checkWaitingOrSent.bind(this),
        label: this.literals['monitorGeneral']['send'],
        visible: this.isTAFFull,
      },
      {
        action: this.prepareModalError.bind(this),
        disabled: this.checkError.bind(this),
        icon: 'po-icon-warning',
        label: this.literals['monitorGeneral']['viewErrors'],
      },
    ];
  }

  public deleteErrorColumn(
    header: Array<HeaderEsocialEventDetails>
  ): Array<HeaderEsocialEventDetails> {
    let index: number;

    index = header.findIndex(column => column.property === 'error');
    if (index >= 0) {
      header.splice(index, 1);
    }
    return header;
  }

  public setStatusOptions(): void {
    this.statusOptions = [
      {
        label: this.literals['monitorStatus']['pending'],
        value: '1',
        color: 'color-09',
      },
      {
        label: this.literals['monitorStatus']['waiting'],
        value: '2',
        color: 'color-07',
      },
      {
        label: this.literals['monitorStatus']['rejected'],
        value: '3',
        color: 'color-08',
      },
      {
        label: this.literals['monitorStatus']['success'],
        value: '4',
        color: 'color-11',
      },
      {
        label: this.literals['monitorStatus']['deleted'],
        value: '5',
        color: 'color-07',
      },
    ];
  }

  public setEventsCard(): void {
    this.eventCards.push({
      eventCode: this.eventName,
      eventDescription: this.eventDescription,
      total: 0,
      status: [],
      checked: true,
    });
  }

  public setSavedFilters(): void {
    const savedfilters = this.socialUserFilterService.getUserFilter();

    savedfilters.forEach(element => {
      if (element.id === 'branch' || element.id === 'period') {
        this.detailFilter.push(element);
      }
    });
    this.page++;
    this.filter = {
      companyCode: '',
      companyId: this.companyId,
      branches: this.branches,
      id: '',
      eventCode: this.eventName,
      period: this.period,
      periodFrom: this.periodFrom,
      motiveCode: this.motiveCode,
      periodTo: this.periodTo,
      status: this.status,
      userId: '',
      page: this.page,
      pageSize: this.pageSize,
    };
  }

  public setHeaderTitle(): void {
    this.headerTitle = `${this.eventName} - ${this.eventDescription}`;
  }

  public getRoute(): void {
    this.route.queryParams.subscribe(params => {
      this.eventName = params['event'];
      this.eventDescription = params['description'];
      this.status = params['status'];
      this.branches = params['branches'];
      this.period = params['period'];
      this.periodFrom = params['periodFrom'];
      this.motiveCode = params['motiveCode'];
      this.periodTo = params['periodTo'];
      this.total = params['total'];
    });
  }

  public getNumberOfRows(): boolean {
    return this.poTable.getSelectedRows().length === 1;
  }

  public openModalErrorDetail(key: string): void {
    const params = {
      companyId: this.companyId,
      key: key ? key : '',
      eventCode: this.eventName,
    };

    this.modalTitle = this.literals['monitorGeneral']['viewErrors'];

    this.isEditXml = false;
    this.showStatusMessage = false;

    this.monitorDetailService
      .getDetailsError(params, this.menuContext, this.isTAFFull)
      .subscribe(
        payload => {
          this.textAreaInfo = payload.description;
          this.labelTextAreaInfo = this.literals['monitorGeneral'][
            'detailErrors'
          ];
          this.modal.open();
        },
        error =>
          this.monitorDetailService
            .getDetailsError(params, this.menuContext, this.isTAFFull)
            .subscribe(
              payload => {
                this.textAreaInfo = payload.description;
                this.labelTextAreaInfo = this.literals['monitorGeneral'][
                  'detailErrors'
                ];
                this.modal.open();
              },
              errorNotify => this.poNotification.error(errorNotify)
            )
      );
  }

  public closeModal(): void {
    this.cleanEditor();
    this.modal.close();
  }

  public updateEventDetails(): void {
    const auxDetailFilter = this.detailFilter;

    this.showTableLoading = true;
    this.isButtonPrintCatDisabled = true;
    this.page = 1;

    const filter = {
      companyCode: '',
      companyId: this.companyId,
      branches: this.branches,
      id: '',
      eventCode: this.eventName,
      period: this.period,
      periodTo: this.periodTo,
      periodFrom: this.periodFrom,
      motiveCode: this.motiveCode,
      status: this.status,
      userId: '',
      genericFilter: this.searchValue,
      periodFilter: this.searchValuePer,
      page: this.page,
      pageSize: this.pageSize,
    };

    this.showCounter = !this.searchValue ? true : false;
    this.showCounter = !this.searchValuePer ? true : false;

    this.loadEventDetails(filter);

    this.detailFilter = [];
    auxDetailFilter.forEach(element => {
      if (element.id != 'keys') {
        this.detailFilter.push(element);
      }
    });
    this.poTable.unselectRows();
    this.eventsSelected = [];
  }

  public loadEventDetails(filter: EsocialDetailsFilter): void {
    let columns: Array<HeaderEsocialEventDetails>;

    this.numberInPage = this.total < this.pageSize ? this.total : this.pageSize;
    this.monitorDetailService
      .getEventDetails(filter, this.menuContext, this.isTAFFull)
      .subscribe(
        payload => {
          columns = this.setColumns(payload.header, payload.items);
          this.getColumns(columns);
          this.itemsDetailEvents = this.getItemsDetailEvents(payload.items);
          this.hasNext = !payload.hasNext;
          this.showTableLoading = false;
          this.ref.detectChanges();
        },
        error => this.poNotification.error(error)
      );
  }

  public onSelectEvent(event: Object): void {
    let keyFilter = {};
    const statusApproved = '4';
    const statusWaiting = '2';
    const statusExcluded = '5';

    if (event['status'] !== statusWaiting) {
      keyFilter['value'] = event['key'];
      keyFilter['id'] = 'keys';
      this.detailFilter.push(keyFilter);
      this.isButtonTransmissionDisabled = false;
    } else {
      event['$selected'] = false;
      this.poNotification.warning(
        this.literals['monitorDetail']['transmissionPermission']
      );
    }

    if (
      event['status'] === statusApproved ||
      event['status'] === statusExcluded
    ) {
      this.isButtonTransmissionDisabled = true;
    }

    this.eventsSelected.push(event);
    this.verifyItemSuccess();
    this.isButtonEditXmlDisabled = !this.getNumberOfRows();

    keyFilter = {};
  }

  public onUnSelectEvent(event: Object): void {
    const selectedItems = this.poTable.getSelectedRows();

    this.detailFilter.splice(this.detailFilter.indexOf(event['key']), 1);
    if (selectedItems.length > 0) {
      this.isButtonTransmissionDisabled = false;
    } else {
      this.isButtonTransmissionDisabled = true;
    }

    this.removeItem(event);
    this.verifyItemSuccess();

    this.isButtonEditXmlDisabled = !this.getNumberOfRows();
  }

  public removeItem(event: Object): void {
    this.eventsSelected.forEach(element => {
      let position;
      if (element.key === event['key']) {
        position = this.eventsSelected.indexOf(event);
        this.eventsSelected.splice(position, 1);
      }
    });
  }

  public onSelectAllEvents(event: Array<Object>): void {
    let keyFilter = {};
    const statusWaiting = '2';
    const savedfilters = this.socialUserFilterService.getUserFilter();

    event.forEach(element => {
      this.eventsSelected.push(element);
      this.detailFilter.splice(this.detailFilter.indexOf(element['key']), 1);
    });

    savedfilters.forEach(element => {
      if (element.id === 'branch') {
        this.detailFilter.push(element);
      }
    });

    event.forEach(element => {
      if (element['status'] !== statusWaiting) {
        this.isButtonTransmissionDisabled = false;

        keyFilter['value'] = element['key'];
        keyFilter['id'] = 'keys';

        this.detailFilter.push(keyFilter);
        keyFilter = {};
      } else {
        element['$selected'] = false;
      }
    });

    this.isButtonEditXmlDisabled = !this.getNumberOfRows();

    this.verifyItemSuccess();
  }

  public verifyItemSuccess(): void {
    this.eventsSelected.forEach(element => {
      if (element.status === '4' || element.status === '5') {
        this.isButtonTransmissionDisabled = true;
      }
    });

    this.isButtonPrintCatDisabled =
      this.eventsSelected.length === 0 ? true : this.eventsSelected.some((element) => element.status !== '4');
  }

  public onUnSelectAllEvents(event: Array<Object>): void {
    event.forEach(element => {
      this.detailFilter.splice(this.detailFilter.indexOf(element['key']), 1);
    });
    this.isButtonTransmissionDisabled = true;
    this.isButtonEditXmlDisabled = true;
    this.isButtonPrintCatDisabled = true;
    this.eventsSelected = [];
  }

  public prepareOpenXmlEditor(): void {
    const { key } = this.poTable.getSelectedRows()[0];
    const params = {
      companyId: this.companyId,
      id: key,
    };
    sessionStorage['TAFBusiness'] = '{"eSocialXmlId":"' + key + '"}';
    this.modalTitle = this.literals['monitorGeneral']['xmlEditor'];
    this.isCodeEditorReadOnly = false;
    this.openXmlEditorModal(params);
  }

  public openXmlEditorModal(params: GetXmlEditRequest): void {
    this.editorXmlService
      .getXmlEdit(params, this.menuContext, this.isTAFFull)
      .subscribe(
        payload => {
          this.code = this.prettifyXml(atob(payload.xmlMessage));
          this.hashCode = Md5.init(this.code);
          this.modal.open();
        },
        error => this.poNotification.error(error)
      );
  }

  public dialogConfirmTransmission() {
    this.dialogConfirm.confirm({
      literals: {
        cancel: this.literals['monitorDetail']['cancel'],
        confirm: this.literals['monitorDetail']['confirm'],
      },
      title: this.literals['monitorDetail']['cofirmTransmission'],
      message: this.literals['monitorDetail']['viewTransmission'],
      confirm: () => this.sendCompanyRemove(),
    });
  }

  public async sendCompanyRemove(): Promise<any> {
    const companyId = this.socialMonitorService.getCompany();
    const params: SocialRemoveCompanyRequest = {
      companyId: companyId,
    };
    this.TAFEsocialRemoveCompany.getRemoveCompanyRet(params).subscribe();
    const alerTransmission = (await this.TAFEsocialRemoveCompany.getRemoveCompanyRet(
      params
    ).toPromise()).statusMessage;

    this.dialogConfirm.alert({
      title: this.literals['monitorDetail']['confirmTransmission'],
      message: alerTransmission,
    });
  }

  public disableButtonRemoveCompanyRet(
    isButtonRemoveCompanyRet: boolean
  ): boolean {
    return this.isTAFFull &&
      this.eventName === 'S-1000' &&
      this.layoutEnvironment === 'restrictedProduction'
      ? true
      : isButtonRemoveCompanyRet;
  }

  public prepareOpenXmlViewer(row): void {
    const params = {
      companyId: this.companyId,
      id: row.key,
    };
    this.modalTitle = this.literals['monitorGeneral']['xmlViewer'];
    this.isCodeEditorReadOnly = true;
    this.openXmlViewerModal(params);
  }

  public openXmlViewerModal(params: GetXmlEditRequest): void {
    this.editorXmlService
      .getXmlEdit(params, this.menuContext, this.isTAFFull)
      .subscribe(payload => {
        this.code = this.prettifyXml(atob(payload.xmlMessage));
        this.modal.open();
      });
  }

  public showMessageSuccess(message: object): void {
    this.prepareStatusMessage(message['title'], message['statusMessage']);
    this.isEditXml = message['isEditeXML'];
    this.showStatusMessage = true;
  }

  public showMessageError(message: object): void {
    this.prepareStatusMessage(message['title'], message['statusMessage']);
  }

  public prepareStatusMessage(title: string, message: string): void {
    this.statusMessage = message ? message : '';
    this.modalTitle = title;
  }

  public cleanEditor(): void {
    this.isEditXml = true;
    this.showStatusMessage = false;
  }

  public prettifyXml(sourceXml: string): string {
    const xmlDoc = new DOMParser().parseFromString(
      sourceXml,
      'application/xml'
    );
    const xsltDoc = new DOMParser().parseFromString(
      [
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">',
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
      ].join('\n'),
      'application/xml'
    );

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    const resultXml = new XMLSerializer().serializeToString(resultDoc);

    return resultXml;
  }

  public showMoreRegisters(sortColumn: PoTableColumnSort): void {
    let aux = [];

    this.loadingShowMore = true;
    this.setSavedFilters();

    this.monitorDetailService
      .getEventDetails(this.filter, this.menuContext, this.isTAFFull)
      .subscribe(payload => {
        aux = this.getItemsDetailEvents(payload.items);
        aux.forEach(element => {
          this.itemsDetailEvents.push(element);
        });
        this.sortColumnDetail(sortColumn);
        this.showTableLoading = false;
        this.loadingShowMore = false;
        this.hasNext = !payload.hasNext;
        this.numberInPage =
          this.hasNext === false
            ? this.numberInPage + this.filter.pageSize
            : this.total;
      });
  }

  public disableButtonEditXml(isButtonEditXmlDisabled: boolean): boolean {
    return this.isTAFFull ? true : isButtonEditXmlDisabled;
  }

  public validatesAndFormatsTaxNumber(value: string): string {
    if (value.trim().length === 11) {
      return cpf.isValid(value) ? this.masksPipe.transform(value) : value;
    } else if (value.trim().length === 14) {
      return cnpj.isValid(value) ? this.masksPipe.transform(value) : value;
    } else {
      return value;
    }
  }

  public getTAFFull(): void {
    const parse = JSON.parse(sessionStorage.getItem('TAFFull'));
    this.isTAFFull = parse;
  }

  public outputHideCounter(hideCounter): void {
    this.hideCounter = hideCounter;
  }

  public disableButtonInsert(isButtonInsertRet: boolean): boolean {
    const events =
      'S-1070|S-1200|S-1202|S-1210|S-2200|S-2205|S-2206|S-2241|S-2300|S-2306|S-2400|S-2405|S-2410|S-2416|S-2418|S-2420|S-2230|S-5001|S-5002|S-5003|S-5011|S-5012|S-5013|S-5501';
    return this.isTAFFull && !this.eventName.match(events)
      ? true
      : isButtonInsertRet;
  }

  public setInsert(): void {
    this.setOperation(null, 'insert');
  }

  public setUpdate(row): void {
    this.setOperation(row, 'update');
  }

  public setDelete(row): void {
    this.setOperation(row, 'delete');
  }

  public setView(row): void {
    this.setOperation(row, 'view');
  }

  public setOperation(row, action: string): void {
    const me: any = this;
    const totvstec = 'totvstec';
    const twebchannel = 'twebchannel';

    me.showPageLoading = true;

    if (window[totvstec]?.gotConnection) {
      this.execView(totvstec, action, row, me);
    } else if (window[twebchannel]?.gotConnection) {
      this.execView(twebchannel, action, row, me);
    } else {
      me.showPageLoading = false;
      me.poNotification.warning(this.literals['systemInfos']['advplToJsFail']);
    }
  }

  public actionsSendTransmit(row) {
    this.showPageLoading = true;
    this.actionsSend.onClickTransmit(row);
    this.showPageLoading = false;
  }

  private getItemsDetailEvents(
    itemsEsocialEventDetails: ItemsEsocialEventDetails[]
  ): Array<ItemsEsocialEventDetails> {
    const itemsDetailTable = this.setItemsDetailEvents(
      itemsEsocialEventDetails
    );

    return itemsDetailTable;
  }

  private setItemsDetailEvents(
    itemsEsocialEventDetails: ItemsEsocialEventDetails[]
  ): Array<ItemsEsocialEventDetails> {
    const itemsDetailTable = [];
    let dynamicItem = {};
    itemsEsocialEventDetails.forEach(element => {
      element.item.forEach(item => {
        dynamicItem['key'] = item.key;
        item.columns.forEach(children => {
          children.value = this.validatesAndFormatsTaxNumber(children.value);

          if (children.property === 'error' && item.hasError) {
            dynamicItem[children.property] = this.literals['monitorGeneral'][
              'viewErrors'
            ];
          } else {
            dynamicItem[children.property] = children.value;
          }
        });

        itemsDetailTable.push(dynamicItem);
        dynamicItem = {};
      });
    });
    return itemsDetailTable;
  }

  private getPropertyColumnVisible(): ColumnProperty<boolean> {
    return {
      ['NIS']: false,
      ['Nome do Médico']: false,
      ['CRM do Médico']: false,
      ['CPF Médico Responsável/Coordenador PCMSO']: false,
      ['Nome Médico Responsável/Coordenador PCMSO']: false,
      ['CRM do médico Responsável/Coordenador PCMSO']: false,
    };
  }

  private getSocialStatusEnvironment(): void {
    this.socialStatusEnvironment
      .getSocialStatusEnvironment({
        companyId: this.socialMonitorService.getCompany(),
      })
      .toPromise()
      .then(
        response => (this.layoutEnvironment = response.statusEnvironmentSocial)
      );
  }

  private execView(channel: string, action: string, row: any, me: this): void {
    let content = '';

    if (action !== 'insert') {
      content = row.key;
    }

    window[channel].jsToAdvpl(
      'execView',
      `${action}|${this.eventName}|${content}`
    );
    window[channel].advplToJs = (codeType, codeContent) => {
      if (codeType === 'setFinishExecView' && codeContent === 'true') {
        me.loadEventDetails(me.filter);
      }

      me.showPageLoading = false;
      me.ref.detectChanges();
    };
  }

  public printOutCat(): void {
    const selectedCatsKeys: Array<string> = [];
    this.eventsSelected.forEach(cat => {
      selectedCatsKeys.push(cat['key']);
    });
    this.catReport.preparePrintReport(selectedCatsKeys, this.companyId);
  }

  public formIssuance(isButtonformIssuance: boolean): boolean {
    return this.isTAFFull && this.eventName === 'S-2210' ? true : isButtonformIssuance;
  }

  public updateIsLoadingPrint(event: boolean): void {
    this.isLoadingPrint = event;
  }

  private sortColumnDetail(sortColumn: PoTableColumnSort): void {
    if (sortColumn) {
      this.itemsDetailEvents.sort((a, b) => {
        if (sortColumn.type === 'ascending') {
          return a[sortColumn.column.property] < b[sortColumn.column.property] ? -1 : 0;
        }

        return a[sortColumn.column.property] > b[sortColumn.column.property] ? -1 : 0;
      });
    }
  }

  public placeholderGenericFilter(): string {
    switch (this.eventName) {
      case 'S-2500':
        return this.literals['monitorGeneral']['processNumberOrCPF'];

      case 'S-2501':
        return this.literals['monitorGeneral']['processNumber'];

      case 'S-3500':
        return this.literals['monitorGeneral']['processNumberOrCPF'];

      default:
        return this.literals['monitorGeneral']['searchByNameOrCPF'];
    }
  }
}
