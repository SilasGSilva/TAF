import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PoDialogService, PoTableColumnSort } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { DialogModalResponse } from 'shared/dialog-modal-response/dialog-modal-response.service';
import { IReportsCanDeactivate } from '../guards/ireports-deactivate';
import { ESocialBaseConferIrrfRetValuesResponse } from './irrf-models/ESocialBaseConferIrrfRetValuesResponse';
import { ESocialBaseConferIrrfRetValues } from './irrf-models/ESocialBaseConferIrrfRetValues';
import { ESocialBaseConferIrrfTableItems } from './irrf-models/ESocialBaseConferIrrfTableItems';
import { ESocialBaseConferIrrfRetCardValuesResponse } from './irrf-models/ESocialBaseConferIrrfRetCardValuesResponse';
import { Demonstratives } from './irrf-models/Demonstratives';
import { IrrfReportFilterService } from './irrf-report-filter/services/irrf-report-filter.service';
import { IrrfReportParamsStoreService } from '../services/stores/irrf/irrf-report-params-store/irrf-report-params-store.service';
import { IrrfReportCardStoreService } from '../services/stores/irrf/irrf-report-card-store/irrf-report-card-store.service';
import { IrrfReportStoreService } from '../services/stores/irrf/irrf-report-store/irrf-report-store.service';
import { IrrfReportRequestParamsStoreService } from '../services/stores/irrf/irrf-report-request-params-store/irrf-report-request-params-store.service';

@Component({
  selector: 'app-irrf',
  templateUrl: './irrf.component.html',
  styleUrls: ['./irrf.component.scss']
})
export class IrrfComponent implements OnInit, IReportsCanDeactivate {

  public literals = {};
  public progressBarValue = 0;
  public progressBarInfo = '1%';
  public verifyRegisters = false;
  public quantityIrrfRh = '0';
  public quantityIrrfGov = '0';
  public quantityIrrfTaf = '0';
  public itemsTable: Array<ESocialBaseConferIrrfTableItems>;
  public loadingTable: boolean;
  public loadingShowMore: boolean;
  public hasNext: boolean;
  public isTAFFull: boolean;
  public requestId: string;
  public cpfNumber: string;
  public menuContext: string;
  public loadingHidden: boolean;
  public currentReportValues: ESocialBaseConferIrrfRetValuesResponse;
  public emptyResult = false;
  public sending = false;

  constructor(
    private literalsService: LiteralService,
    private irrfReportStoreService: IrrfReportStoreService,
    private irrfReportCardStoreService: IrrfReportCardStoreService,
    private irrfReportParamsStoreService: IrrfReportParamsStoreService,
    private irrfReportRequestParamsStoreService: IrrfReportRequestParamsStoreService,
    private poDialogService: PoDialogService,
    private dialogModalResponse: DialogModalResponse,
    private irrfReportFilterService: IrrfReportFilterService,
    private currencyPipe: CurrencyPipe,
    private masksPipe: MasksPipe,
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.loadingTable = true;
    this.loadingHidden = true;
    this.isTAFFull = JSON.parse(sessionStorage.getItem('TAFFull'));
    this.menuContext = sessionStorage.getItem('TAFContext');
    this.loadTable(this.irrfReportStoreService.getCurrentReportValues(), false);
    this.loadCard(this.irrfReportCardStoreService.getCurrentCardValues(), false);
  }

  public dataSave(): boolean {
    if (this.verifyRegisters) {
      if (
        this.currentReportValues.items[0].employees.length &&
        this.irrfReportParamsStoreService.getReportDataSave()
      ) {
        return true;
      } else if (
        !this.irrfReportStoreService.getCurrentReportValues().items.length
      ) {
        this.resetReport();
      }
    } else {
      this.resetReport();
    }

    return false;
  }

  public dataSaveDialog(): void {
    this.poDialogService.confirm({
      literals: {
        cancel: this.literals['irrfReport']['no'],
        confirm: this.literals['irrfReport']['yes'],
      },
      title: this.literals['irrfReport']['titleReport'],
      message: this.literals['irrfReport']['askDataSave'],
      confirm: () => {
        this.irrfReportParamsStoreService.setReportDataSave();
        this.dialogModalResponse.dialogResponse(true);
        this.emptyResult = false;
      },
      cancel: () => {
        this.irrfReportParamsStoreService.setReportDataSave();
        this.resetReport();
        this.dialogModalResponse.dialogResponse(true);
        this.emptyResult = false;
      },
    });
  }

  public discardReport(): boolean {
    if (!this.verifyRegisters && this.sending) {
      return true;
    }

    return false;
  }

  public discardReportDialog(): void {
    this.poDialogService.confirm({
      literals: {
        cancel: this.literals['irrfReport']['cancel'],
        confirm: this.literals['irrfReport']['confirm'],
      },
      title: this.literals['irrfReport']['titleReport'],
      message: this.literals['irrfReport']['tafDiscardReport'],
      confirm: () => {
        this.emptyResult = false;
        this.resetReport();
        this.irrfReportParamsStoreService.setReportDataSave();
        this.dialogModalResponse.dialogResponse(true);
      },
      cancel: () => {
        this.dialogModalResponse.dialogResponse(false);
      },
    });
  }

  public loadCard(
    payloadReportCard: ESocialBaseConferIrrfRetCardValuesResponse,
    isFromFilter: boolean = true
  ): void {

    if (payloadReportCard?.items[0]?.totalIRRFCompany) {
      this.quantityIrrfTaf = this.convertReal(payloadReportCard.items[0].totalIRRFCompany.tafValue);
      this.quantityIrrfRh = this.convertReal(payloadReportCard.items[0].totalIRRFCompany.erpValue);
      this.quantityIrrfGov = this.convertReal(payloadReportCard.items[0].totalIRRFCompany.retValue);

      this.verifyRegisters = true;
    } else if (this.currentReportValues?.items[0]?.employees?.length > 0) {
      this.quantityIrrfTaf = this.convertReal(0);
      this.quantityIrrfRh = this.convertReal(0);
      this.quantityIrrfGov = this.convertReal(0);

      this.verifyRegisters = true;
    } else if (isFromFilter) {
      this.verifyRegisters = false;
      this.emptyResult = true;
      this.sending = false;
    }

    this.loadingHidden = true;
  }

  public loadTable(
    payloadReportTable: ESocialBaseConferIrrfRetValuesResponse,
    isFromFilter: boolean = true,
    sortColumn: PoTableColumnSort = null
  ): void {
    this.currentReportValues = {
      items: [],
      hasNext: false,
    };

    if (payloadReportTable?.items[0]?.employees?.length > 0) {
      this.currentReportValues = payloadReportTable;
      this.itemsTable = [...this.altArrayItems(payloadReportTable.items[0])];
      if (sortColumn)
        this.sortItemsTable(sortColumn);
      this.hasNext = !payloadReportTable.hasNext;
      this.progressBarValue = 0;
    } else if (isFromFilter) {
      this.emptyResult = true;
      this.sending = false;
      this.progressBarValue = 0;
    }
  }

  public showMoreRegisters(sortColumn: PoTableColumnSort): void {
    const params = this.irrfReportParamsStoreService.getCurrentParams();

    this.loadingShowMore = true;
    params.synthetic = false;
    params.page++;

    this.irrfReportFilterService
      .getIrrfRetValues(params, this.menuContext)
      .subscribe(response => {
        const currentReportValues = this.irrfReportStoreService.getCurrentReportValues();

        this.hasNext = !response.hasNext;
        currentReportValues.hasNext = response.hasNext;

        response.items[0].employees.map(item => {
          currentReportValues.items[0].employees.push(item);
        });

        this.loadTable(currentReportValues, true, sortColumn);
        this.irrfReportStoreService.setNewReportValues(currentReportValues);
      });
  }

  public reset(): void {
    this.progressBarValue = 0;
    this.quantityIrrfRh = '';
    this.quantityIrrfGov = '';
    this.quantityIrrfTaf = '';
    this.itemsTable = [];
    this.verifyRegisters = false;
    this.sending = false;
    this.emptyResult = false;
  }

  public loadBar(progressBarValue: number): void {
    this.progressBarValue = progressBarValue;
    this.progressBarInfo = `${this.progressBarValue}%`;
  }

  public setCpfNumber(cpfNumber: string): void {
    this.cpfNumber = cpfNumber;
  }

  public setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  public sendingStarted(started: boolean): void {
    this.sending = started;
  }

  public loadingReport(loading: boolean): void {
    this.loadingHidden = loading;
  }

  private sortItemsTable(sortColumn: PoTableColumnSort): void {
    this.itemsTable.sort((a, b) => {
      let orderIndex: number;

      if (a[sortColumn.column.property] < b[sortColumn.column.property])
        orderIndex = -1;
      else if (a[sortColumn.column.property] > b[sortColumn.column.property])
        orderIndex = 1;
      else
        orderIndex = 0;

      return sortColumn.type === 'descending' ? orderIndex * -1 : orderIndex;
    });
  }

  private resetReport(): void {
    this.irrfReportStoreService.resetReportValues();
    this.irrfReportCardStoreService.resetCardValues();
    this.irrfReportParamsStoreService.resetCurrentParams();
    this.irrfReportRequestParamsStoreService.resetRequestParams();
    this.reset();
  }

  private convertReal(value: number): string {
    return this.currencyPipe.transform(value, 'BRL', 'symbol', '1.2-2', 'pt');
  }

  private altArrayItems(
    irrfReportItems: ESocialBaseConferIrrfRetValues
  ): Array<ESocialBaseConferIrrfTableItems> {
    this.loadingTable = false;
    this.loadingShowMore = false;

    return irrfReportItems.employees.map(
      (item): ESocialBaseConferIrrfTableItems => {
        return {
          cpfNumber: item.cpfNumber
            ? this.masksPipe.transform(item.cpfNumber)
            : '',
          name: item.name,
          period: item.period,
          tafValue: item.totalIrrfRetention.tafValue,
          erpValue: item.totalIrrfRetention.erpValue,
          retValue: item.totalIrrfRetention.retValue,
          demonstrative: null,
          divergent: item.divergent ? 'divergent' : '',
          warning: item.warning ? 'warning' : '',
        };
      }
    );
  }
}
