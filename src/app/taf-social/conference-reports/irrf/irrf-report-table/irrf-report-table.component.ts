import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { PoDialogService, PoDropdownAction, PoTableColumn, PoTableColumnSort } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { IFaqModal } from 'shared/faq-modal/ifaq-modal';
import { FaqModalComponent } from '../../../../shared/faq-modal/faq-modal.component';
import { CheckFeaturesService } from 'shared/check-features/check-features.service';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { FaqProperties } from '../../../../models/faq-properties';
import { FaqQuestionsSections } from './../../../../models/faq-questions-sections';
import { Demonstratives } from '../irrf-models/Demonstratives';
import { IRAnalyticalEmployee } from '../irrf-models/IRAnalyticalEmployee';
import { ESocialBaseConferRetValuesRequest } from '../../conference-reports-models/ESocialBaseConferRetValuesRequest';
import { ESocialBaseConferValuesRequest } from '../../conference-reports-models/ESocialBaseConferValuesRequest';
import { Employees } from '../irrf-models/Employees';
import { ExportExcelEsocialReportsService } from '../../services/export-excel-esocial-reports.service';
import { IrrfReportParamsStoreService } from '../../services/stores/irrf/irrf-report-params-store/irrf-report-params-store.service';
import { IrrfReportFilterService } from './../irrf-report-filter/services/irrf-report-filter.service';
import { IrrfReportTableModalComponent } from './irrf-report-table-modal/irrf-report-table-modal.component';

@Component({
  selector: 'app-irrf-report-table',
  templateUrl: './irrf-report-table.component.html',
  styleUrls: ['./irrf-report-table.component.scss']
})
export class IrrfReportTableComponent implements OnInit, IFaqModal {
  @ViewChild(FaqModalComponent, { static: true }) irrfFaqModalComponent: FaqModalComponent;
  @ViewChild(IrrfReportTableModalComponent, { static: true }) poModalIrrf: IrrfReportTableModalComponent;
  @ViewChild(MessengerComponent, { static: true }) messengerModal: MessengerComponent;

  @Input('items-table') itemsTable: Array<Employees>;
  @Input('loading-table') loadingTable: boolean;
  @Input('loading-show-more') loadingShowMore: boolean;
  @Input('has-next') hasNext: boolean;
  @Input('is-taf-full') isTAFFull: boolean;
  @Input('cpf-number') cpfNumber: string;
  @Input('request-id') requestId: string;
  @Output('showMore') showMore = new EventEmitter<PoTableColumnSort>();

  public literals = {};
  public companyId: string;
  public menuContext: string;
  public filter = '';
  public currentParams: ESocialBaseConferRetValuesRequest;
  public currentAnalyticsParams: ESocialBaseConferValuesRequest;
  public exportButtonAction: Array<PoDropdownAction>;
  public columns: Array<PoTableColumn>;
  public detailColumns: Array<PoTableColumn>;
  public debounce: Subject<string> = new Subject<string>();
  public faqModal: FaqProperties;
  private requestParams: ESocialBaseConferRetValuesRequest;

  constructor(
    private literalsService: LiteralService,
    private irrfReportFilterService: IrrfReportFilterService,
    private irrfReportParamsStoreService: IrrfReportParamsStoreService,
    private checkFeaturesService: CheckFeaturesService,
    private exportReportFilterService: ExportExcelEsocialReportsService,
    private dialogConfirm: PoDialogService,
  ) {
    this.literals = this.literalsService.literalsTafSocial;
    this.companyId = this.irrfReportFilterService.getCompany();
    this.requestParams = this.irrfReportParamsStoreService.getCurrentParams();
  }

  ngOnInit(): void {
    this.columns = this.getColumns();
    this.detailColumns = this.getDetailColumns();
    this.menuContext = sessionStorage.getItem('TAFContext');
    this.faqModal = {
      title: this.literals['irrfReport']['irrfTitleFaqInformation'],
      summary: this.literals['irrfReport']['irrfFaqInformation'],
      questions: this.getFaqQuestionsSections(),
      buttonPopUp: [
        { label: this.literals['irrfReport']['irrfInformation'] }
      ],
      moreInformations: {
        linkDescription: this.literals['systemInfos']['TDN'], 
        link: 'https://tdn.totvs.com/pages/viewpage.action?pageId=781873283'
      }
    }

    this.exportButtonAction = [
      {
        icon: 'po-icon po-icon-chart-area',
        label: this.literals['irrfReport']['irrfAnalytic'],
        action: () => {this.exportReport(false, {})},
      },
      {
        icon: 'po-icon po-icon-document-filled',
        label: this.literals['irrfReport']['irrfSynthetic'],
        action: () => {this.exportReport(true, {})},
      },
    ];

    this.debounce.pipe(debounceTime(300)).subscribe(filter => {
      this.filter = filter;
    });

    this.irrfReportParamsStoreService.reportParams$.subscribe(
      params => (this.currentParams = params)
    );
  }

  public async exportReport(
    synthetic: boolean,
    {cpfNumber, demonstrativeId}: any
  ): Promise<void> {
    const featuresReturn = this.checkFeaturesService.getFeature('downloadXLS');
    const params = synthetic
      ? {...this.currentParams, cpfNumber: '', level: '1'}
      : {...this.getAnalyticsParams(this.requestId, cpfNumber, demonstrativeId), level: '9'};
    this.loadingTable = true;

    if (featuresReturn.access) {
      await this.exportReportFilterService.PrintReport(
        'IRRF',
        params,
        synthetic,
        this.irrfReportParamsStoreService.getIsConfiguredService()
      );
    } else {
      this.messengerModal.onShowMessage(
        featuresReturn.message,
        false,
        false,
        this.literals['systemInfos']['unupdatedSystem']
      );
    }

    this.loadingTable = false;
  }

  public showMoreRegisters(sortColumn: PoTableColumnSort): void {
    this.showMore.emit(sortColumn);
  }

  public openModalFAQ(): void {
    this.irrfFaqModalComponent.openModal();
  }

  private getDetailColumns(): Array<PoTableColumn> {
    let demonstrativeDetails: Array<PoTableColumn> = [
      {
        property: 'demonstrativeId',
        label: this.literals['irrfReport']['demonstrative'],
        width: '30%',
        type: 'link',
        action: (value: string, item: Demonstratives) => {
          this.prepareModalByDemonstrative(item);
        },
      },
      {
        property: 'category',
        label: this.literals['irrfReport']['category'],
        width: '7%',
      },
      {
        property: 'referencePeriod',
        label: this.literals['irrfReport']['referencePeriod'],
        width: '12%',
      },
      {
        property: 'tafValue',
        label: this.literals['irrfReport']['tafIRRF'],
        width: '12%',
        type: 'currency',
        format: 'BRL'
      },
      {
        property: 'erpValue',
        label: this.literals['irrfReport']['rhIRRF'],
        width: '12%',
        type: 'currency',
        format: 'BRL'
      },
      {
        property: 'retValue',
        label: this.literals['irrfReport']['govIRRF'],
        width: '12%',
        type: 'currency',
        format: 'BRL'
      },
      {
        property: 'payday',
        label: this.literals['irrfReport']['payday'],
        width: '10%',
        type: 'date'
      },
      {
        property: 'origin',
        label: this.literals['irrfReport']['origin'],
        width: '15%',
      },
    ];

    if (!this.isTAFFull) {
      demonstrativeDetails = demonstrativeDetails.filter(itemColumnDetail => !(itemColumnDetail.property === 'tafValue'));
    } else if (!this.irrfReportParamsStoreService.getIsConfiguredService()) {
      demonstrativeDetails = demonstrativeDetails.filter(itemColumnDetail => !(itemColumnDetail.property === 'erpValue'));
    }

    return demonstrativeDetails;
  }

  private getColumns(): Array<PoTableColumn> {
    let columns: Array<PoTableColumn> = [
      {
        property: 'divergent',
        label: ' ',
        width: '4%',
        type: 'icon',
        icons: [
          {
            icon: 'po-icon po-icon-exclamation po-pl-1',
            color: 'color-07',
            tooltip: this.literals['irrfReport']['divergentValues'],
            disabled: () => false,
            value: 'divergent',
          },
          {
            icon: 'po-icon po-icon-exclamation po-pl-1',
            color: 'color-07',
            tooltip: this.literals['irrfReport']['divergentValues'],
            disabled: () => true,
            value: '',
          },
        ],
    },
      {
        property: 'warning',
        label: ' ',
        width: '4%',
        type: 'icon',
        icons: [
          {
            icon: 'po-icon po-icon-security-guard po-pl-1',
            color: 'color-08',
            tooltip: this.literals['irrfReport']['warningValues'],
            disabled: () => false,
            value: 'warning',
          },
          {
            icon: 'po-icon po-icon-security-guard po-pl-1',
            color: 'color-08',
            tooltip: this.literals['irrfReport']['warningValues'],
            disabled: () => true,
            value: '',
          },
        ],
      },
      {
        property: 'name',
        label: this.literals['irrfReport']['name'],
        width: '25%',
        type: 'link',
        action: (value: string, item: Employees) => {
          this.prepareModalByEmployee(item);
        },
      },
      {
        property: 'cpfNumber',
        label: this.literals['irrfReport']['cpf'],
        width: '15%'
      },
      {
        property: 'erpValue',
        label: this.literals['irrfReport']['rhIRRF'],
        type: 'currency',
        format: 'BRL'
      },
      {
        property: 'tafValue',
        label: this.literals['irrfReport']['tafIRRF'],
        type: 'currency',
        format: 'BRL'
      },
      {
        property: 'retValue',
        label: this.literals['irrfReport']['govIRRF'],
        type: 'currency',
        format: 'BRL'
      },
    ];

    if (!this.isTAFFull) {
      columns = columns.filter(itemColumnDetail => !(itemColumnDetail.property === 'tafValue'));
    } else if (!this.irrfReportParamsStoreService.getIsConfiguredService()) {
      columns = columns.filter(itemColumnDetail => !(itemColumnDetail.property === 'erpValue'));
    }

    return columns;
  }

  private getAnalyticsParams(
    requestId: string,
    cpfNumber: string = '',
    demonstrativeId: Array<string> = ['']
  ): ESocialBaseConferValuesRequest {
    this.currentAnalyticsParams = {
      companyId: this.companyId,
      requestId,
      demonstrativeId: demonstrativeId,
      synthetic: false,
      cpfNumber: cpfNumber.replace(/\.|-/gm, ''),
      differencesOnly: this.currentParams.differencesOnly,
      warningsOnly: this.currentParams.warningsOnly,
    };

    return this.currentAnalyticsParams;
  }

  public getFaqQuestionsSections(): Array<FaqQuestionsSections> {
    return [
      {
        questionSectionTitle: this.literals['irrfReport']['irrfSynthetic'],
        questions: [
          {
            questionTitle: this.literals['irrfReport']['tafIRRF'],
            questionAnswer: this.literals['irrfReport']['responseTafIRRF'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['irrfReport']['govIRRF'],
            questionAnswer: this.literals['irrfReport']['responseGovIRRF'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['irrfReport']['rhIRRF'],
            questionAnswer: this.literals['irrfReport']['responseRhIRRF'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['irrfReport']['demonstrative'],
            questionAnswer: this.literals['irrfReport']['responseDemonstrativeEnvelope'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['irrfReport']['esocialCategory'],
            questionAnswer: this.literals['irrfReport']['responseEsocialCategory'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['irrfReport']['referencePeriod'],
            questionAnswer: this.literals['irrfReport']['responseReferencePeriod'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['irrfReport']['payday'],
            questionAnswer: this.literals['irrfReport']['responsePayday'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['irrfReport']['typeOfPayment'],
            questionAnswer: this.literals['irrfReport']['responseTypeOfPayment'],
            tafFull: true,
          },
        ],
      }
    ];
  }

  public expandEmployeeDemonstratives(employee: Employees): void {
    const employeeIndex: number = this.itemsTable.findIndex(element => element.cpfNumber == employee.cpfNumber);

    if (!this.itemsTable[employeeIndex].demonstrative) {
      this.requestParams.synthetic = false;
      this.requestParams.cpfNumber = employee.cpfNumber.replace(/\.|-/gm, '');
      this.requestParams.level = '2';
      this.requestParams.page = 1;
      this.loadingTable = true;
      delete this.requestParams.demonstrativeId;
  
      this.irrfReportFilterService
        .getIrrfRetValues(this.requestParams, this.menuContext)
        .subscribe(response => {
          this.itemsTable[employeeIndex].demonstrative = response?.items[0]?.employees[0]?.demonstrative?.map((value) => {
            return {
              employeeIndex: employeeIndex,
              ...value, 
              ...value.irrfRetention
            };
          });
  
          this.loadingTable = false;
      });
    }
  }

  private prepareModalByDemonstrative(chosenDemo: Demonstratives): void {
    const employeeIndex: number = chosenDemo['employeeIndex'];
    const demonstrativeIndex: number = this.itemsTable[employeeIndex].demonstrative.findIndex(element => element.demonstrativeId == chosenDemo.demonstrativeId);
    const employeeAnalyticalData: IRAnalyticalEmployee = {
      cpfNumber: this.itemsTable[employeeIndex].cpfNumber,
      name: this.itemsTable[employeeIndex].name,
      demonstrativeId: [chosenDemo.demonstrativeId],
      typesIrrfValues: this.itemsTable[employeeIndex].demonstrative[demonstrativeIndex].typesIrrfValues
    };

    if (this.itemsTable[employeeIndex].demonstrative[demonstrativeIndex].typesIrrfValues) {
      this.poModalIrrf.openModal(employeeAnalyticalData);
    } else {
      this.requestParams.demonstrativeId = employeeAnalyticalData.demonstrativeId[0];
      this.requestParams.level = '4';
      this.loadingTable = true;

      this.irrfReportFilterService
        .getIrrfRetValues(this.requestParams, this.menuContext)
        .subscribe(response => {
          this.itemsTable[employeeIndex].demonstrative[demonstrativeIndex].typesIrrfValues = response?.items[0]?.employees[0]?.demonstrative[0]?.typesIrrfValues;
          employeeAnalyticalData.typesIrrfValues = this.itemsTable[employeeIndex].demonstrative[demonstrativeIndex].typesIrrfValues;
          this.poModalIrrf.openModal(employeeAnalyticalData);
          this.loadingTable = false;
        }
      );
    }
  }

  private prepareModalByEmployee(chosenEmployee: Employees): void { 
    const employeeAnalyticalData: IRAnalyticalEmployee = {
      cpfNumber: chosenEmployee.cpfNumber,
      name: chosenEmployee.name,
      demonstrativeId: null,
      typesIrrfValues: null
    }; 
    
    this.requestParams.synthetic = false;
    this.requestParams.cpfNumber = employeeAnalyticalData.cpfNumber.replace(/\.|-/gm, '');
    this.requestParams.level = '3';
    this.requestParams.page = 1;
    this.loadingTable = true;
    delete this.requestParams.demonstrativeId;

    this.irrfReportFilterService
      .getIrrfRetValues(this.requestParams, this.menuContext)
      .subscribe(response => {
        employeeAnalyticalData.demonstrativeId = response?.items[0]?.employees[0]?.totalDemonstratives?.demonstrative;
        employeeAnalyticalData.typesIrrfValues = response?.items[0]?.employees[0]?.totalDemonstratives?.typesIrrfValues;
        this.poModalIrrf.openModal(employeeAnalyticalData);
        this.loadingTable = false;
      }
    );
  }
}
