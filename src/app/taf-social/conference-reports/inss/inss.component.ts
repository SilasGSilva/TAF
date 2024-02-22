import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PoChartSerie, PoDialogService } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { LiteralService } from '../../../core/i18n/literal.service';
import { DialogModalResponse } from '../../../shared/dialog-modal-response/dialog-modal-response.service';
import { LegacyStatusEnvironmentModalComponent } from '../../../shared/legacy-status-environment/legacy-status-environment-modal.component';
import { MasksPipe } from '../../../shared/pipe/masks.pipe';
import { ExecuteAnalyticalEsocialBaseConferRequest } from '../conference-reports-models/ExecuteAnalyticalEsocialBaseConferRequest';
import { ESocialBaseConferInssRetValues } from '../conference-reports-models/ESocialBaseConferInssRetValues';
import { ESocialBaseConferInssRetValuesResponse } from '../conference-reports-models/ESocialBaseConferInssRetValuesResponse';
import { IReportsCanDeactivate } from '../guards/ireports-deactivate';
import { InssReportCardStoreService } from '../services/stores/inss/inss-report-card-store/inss-report-card-store.service';
import { InssReportParamsStoreService } from '../services/stores/inss/inss-report-params-store/inss-report-params-store.service';
import { InssReportRequestParamsStoreService } from '../services/stores/inss/inss-report-request-params-store/inss-report-request-params-store.service';
import { InssReportStoreService } from '../services/stores/inss/inss-report-store/inss-report-store.service';
import { EstablishmentReportFilterService } from './inss-report-filter/inss-report-filter-establishment.service';
import { InssReportFilterService } from './inss-report-filter/services/inss-report-filter.service';

@Component({
  selector: 'app-inss',
  templateUrl: './inss.component.html',
  styleUrls: ['./inss.component.scss'],
})
export class InssComponent implements OnInit, IReportsCanDeactivate {
  @ViewChild(LegacyStatusEnvironmentModalComponent, { static: true })
  legacyStatusEnvironment: LegacyStatusEnvironmentModalComponent;

  public reportStoreSubscription: Subscription;
  public reportCardStoreSubscription: Subscription;
  public literals = {};
  public itemsTable = [];
  public progressBarValue = 0;
  public progressBarInfo = '';
  public quantityInssRh = '0';
  public quantityInssGov = '0';
  public quantityInssTaf = '0';
  public pageLink = '/inssReport';
  public disabledInputs = false;
  public progressSuccess = false;
  public loadingTable: boolean;
  public verifyRegisters = false;
  public emptyResult = false;
  public isTAFFull: boolean;
  public showMore: boolean;
  public hasNext: boolean;
  public requestId: string;
  public analyticalFilterParams: ExecuteAnalyticalEsocialBaseConferRequest;
  public syntheticItems = [];
  public chartDashboardRhData = Array<PoChartSerie>();
  public chartDashboardTafData = Array<PoChartSerie>();
  public chartDashboardRetData = Array<PoChartSerie>();
  public isFromFilter: boolean;
  public currentReportValues: ESocialBaseConferInssRetValuesResponse;
  public currentCardReportValues: ESocialBaseConferInssRetValuesResponse;
  public menuContext: string;
  public sending = false;
  public companyId = this.inssReportFilterService.getCompany();
  public loadingHidden: boolean;

  constructor(
    private literalsService: LiteralService,
    private inssReportStoreService: InssReportStoreService,
    private inssReportCardStoreService: InssReportCardStoreService,
    private inssReportParamsStoreService: InssReportParamsStoreService,
    private inssReportRequestParamsStoreService: InssReportRequestParamsStoreService,
    private inssReportFilterService: InssReportFilterService,
    private masksPipe: MasksPipe,
    private currencyPipe: CurrencyPipe,
    private poDialogService: PoDialogService,
    private dialogModalResponse: DialogModalResponse,
    private establishmentService: EstablishmentReportFilterService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.loadingTable = true;
    this.loadingHidden = true;
    this.isTAFFull = JSON.parse(sessionStorage.getItem('TAFFull'));
    this.menuContext = sessionStorage.getItem('TAFContext');
    this.loadTable(this.inssReportStoreService.getCurrentReportValues(), false);
    this.loadCard(this.inssReportCardStoreService.getCurrentCardValues(), false);
  }

  public setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  public setAnalyticalFilterParams(analyticalFilterParams: ExecuteAnalyticalEsocialBaseConferRequest): void {
    this.analyticalFilterParams = analyticalFilterParams;
  }

  public loadBar(progressBarValue: number): void {
    if (progressBarValue < 100) {
      this.disabledInputs = true;
      this.progressBarValue = progressBarValue;
      this.progressBarInfo = `${this.progressBarValue}%`;
    } else {
      this.disabledInputs = false;
      this.progressBarValue = progressBarValue;
      this.progressBarInfo = `${this.progressBarValue}%`;
      this.progressSuccess = true;
    }
  }

  public loadingReport(loading: boolean): void {
    this.loadingHidden = loading;
  }

  public showMoreRegisters(): void {
    const params = this.inssReportParamsStoreService.getCurrentParams();

    this.loadingTable = true;
    params.synthetic = false;
    params.page++;

    this.inssReportFilterService
      .getInssRetValues(params, this.menuContext)
      .subscribe(response => {
        const currentReportValues = this.inssReportStoreService.getCurrentReportValues();

        this.hasNext = !response.hasNext;
        currentReportValues.hasNext = response.hasNext;

        response.items.map(item => {
          currentReportValues.items.push(item);
        });

        this.loadTable(currentReportValues);
        this.inssReportStoreService.setNewReportValues(currentReportValues);
      });
  }

  public loadCard(
    payloadReportCard: ESocialBaseConferInssRetValuesResponse,
    isFromFilter: boolean = true
  ): void {
    this.currentCardReportValues = payloadReportCard;

    if (payloadReportCard?.items?.length > 0) {
      this.quantityInssTaf = this.convertReal(
        payloadReportCard.items[0].inssTafGrossValue +
        payloadReportCard.items[0].inss13TafGrossValue
      );
      this.quantityInssRh = this.convertReal(
        payloadReportCard.items[0].inssGrossValue +
        payloadReportCard.items[0].inss13GrossValue
      );
      this.quantityInssGov = this.convertReal(
        payloadReportCard.items[0].inssRetGrossValue +
        payloadReportCard.items[0].inss13RetGrossValue
      );

      this.verifyRegisters = true;
    } else if (this.currentReportValues?.items?.length > 0) {
      this.quantityInssTaf = this.convertReal(0);
      this.quantityInssRh = this.convertReal(0);
      this.quantityInssGov = this.convertReal(0);

      this.verifyRegisters = true;
    } else if (isFromFilter) {
      this.verifyRegisters = false;
      this.emptyResult = true;
      this.sending = false;
    }

    this.loadingHidden = true;
  }

  public loadTable(
    payloadReportTable: ESocialBaseConferInssRetValuesResponse,
    isFromFilter: boolean = true
  ): void {
    this.currentReportValues = {
      items: [],
      hasNext: false,
    };

    if (payloadReportTable?.items?.length > 0) {
      this.currentReportValues = payloadReportTable;
      this.itemsTable = [...this.altArrayItems(payloadReportTable.items)];
      this.showMore = undefined;
      this.hasNext = !payloadReportTable.hasNext;
      this.progressBarValue = undefined;
    } else if (isFromFilter) {
      this.emptyResult = true;
      this.sending = false;
      this.showMore = undefined;
      this.progressBarValue = undefined;
    }
  }

  public reset(): void {
    this.progressBarValue = undefined;
    this.progressSuccess = undefined;
    this.quantityInssRh = '';
    this.quantityInssGov = '';
    this.quantityInssTaf = '';
    this.itemsTable = [];
    this.verifyRegisters = false;
    this.sending = false;
    this.emptyResult = false;
  }

  public resetReport(): void {
    this.inssReportStoreService.resetReportValues();
    this.inssReportCardStoreService.resetCardValues();
    this.inssReportParamsStoreService.resetCurrentParams();
    this.inssReportRequestParamsStoreService.resetRequestParams();
    this.reset();
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
        cancel: this.literals['inssReport']['cancel'],
        confirm: this.literals['inssReport']['confirm'],
      },
      title: this.literals['inssReport']['titleReport'],
      message: this.literals['inssReport']['tafDiscardReport'],
      confirm: () => {
        this.emptyResult = false;
        this.resetReport();
        this.inssReportParamsStoreService.setReportDataSave();
        this.dialogModalResponse.dialogResponse(true);
      },
      cancel: () => {
        this.dialogModalResponse.dialogResponse(false);
      },
    });
  }

  public dataSave(): boolean {
    if (this.verifyRegisters) {
      if (
        this.currentReportValues.items.length &&
        this.inssReportParamsStoreService.getReportDataSave()
      ) {
        return true;
      } else if (
        !this.inssReportStoreService.getCurrentReportValues().items.length
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
        cancel: this.literals['inssReport']['no'],
        confirm: this.literals['inssReport']['yes'],
      },
      title: this.literals['inssReport']['titleReport'],
      message: this.literals['inssReport']['askDataSave'],
      confirm: () => {
        this.inssReportParamsStoreService.setReportDataSave();
        this.dialogModalResponse.dialogResponse(true);
        this.emptyResult = false;
      },
      cancel: () => {
        this.inssReportParamsStoreService.setReportDataSave();
        this.resetReport();
        this.dialogModalResponse.dialogResponse(true);
        this.emptyResult = false;
      },
    });
  }

  private altArrayItems(
    inssReportItems: ESocialBaseConferInssRetValues<number, boolean>[]
  ): ESocialBaseConferInssRetValues<string, string>[] {
    this.loadingTable = false;

    return inssReportItems.map(
      (item): ESocialBaseConferInssRetValues<string, string> => {
        return {
          cpfNumber: item.cpfNumber
            ? this.masksPipe.transform(item.cpfNumber)
            : '',
          name: item.name,
          inssGrossValue: this.convertReal(item.inssGrossValue),
          inssTafGrossValue: this.convertReal(item.inssTafGrossValue),
          inssRetGrossValue: this.convertReal(item.inssRetGrossValue),
          inssRetDescGrossValue: this.convertReal(item.inssRetDescGrossValue),
          inss13GrossValue: this.convertReal(item.inss13GrossValue),
          inss13TafGrossValue: this.convertReal(item.inss13TafGrossValue),
          inss13RetGrossValue: this.convertReal(item.inss13RetGrossValue),
          inss13DescGrossValue: this.convertReal(item.inss13DescGrossValue),
          familySalaryValue: this.convertReal(item.familySalaryValue),
          familySalaryTafValue: this.convertReal(item.familySalaryTafValue),
          familySalaryRetValue: this.convertReal(item.familySalaryRetValue),
          maternitySalaryValue: this.convertReal(item.maternitySalaryValue),
          maternitySalaryTafValue: this.convertReal(
            item.maternitySalaryTafValue
          ),
          maternitySalaryRetValue: this.convertReal(
            item.maternitySalaryRetValue
          ),
          maternitySalary13Value: this.convertReal(item.maternitySalary13Value),
          maternitySalary13TafRetValue: this.convertReal(
            item.maternitySalary13TafRetValue
          ),
          maternitySalary13RetValue: this.convertReal(
            item.maternitySalary13RetValue
          ),
          divergent: item.divergent ? 'divergent' : '',
        };
      }
    );
  }

  private convertReal(value: number): string {
    return this.currencyPipe.transform(value, 'BRL', 'symbol', '1.2-2', 'pt');
  }

  public getPageLink(): string {
    return this.pageLink;
  }

  public sendingStarted(started: boolean): void {
    this.sending = started;
  }
}
