import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { PoDropdownAction, PoModalAction, PoModalComponent, PoPopupAction, PoTableColumn, PoTableColumnSort, PoTableDetail } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { cpf } from 'cpf-cnpj-validator';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CheckFeaturesService } from 'shared/check-features/check-features.service';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { FaqModalComponent } from 'shared/faq-modal/faq-modal.component';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { MoreInformations } from './../../../../models/more-informations';
import { ExecuteAnalyticalEsocialBaseConferRequest } from '../../conference-reports-models/ExecuteAnalyticalEsocialBaseConferRequest';
import { FaqQuestionsSections } from './../../../../models/faq-questions-sections';
import { ESocialBaseConferRetValuesRequest } from '../../conference-reports-models/ESocialBaseConferRetValuesRequest';
import { ESocialBaseConferInssTableItems } from '../../conference-reports-models/ESocialBaseConferInssTableItems';
import { ESocialBaseConferInssValues } from '../../conference-reports-models/ESocialBaseConferInssValues';
import { ESocialBaseConferValuesRequest } from '../../conference-reports-models/ESocialBaseConferValuesRequest';
import { ESocialBaseConferInssValuesResponse } from '../../conference-reports-models/ESocialBaseConferInssValuesResponse';
import { ExportExcelEsocialReportsService } from '../../services/export-excel-esocial-reports.service';
import { InssReportParamsStoreService } from '../../services/stores/inss/inss-report-params-store/inss-report-params-store.service';
import { InssReportStoreService } from '../../services/stores/inss/inss-report-store/inss-report-store.service';
import { InssReportFilterService } from '../inss-report-filter/services/inss-report-filter.service';
import { InssReportTableService } from './services/inss-report-table.service';

@Component({
  selector: 'app-inss-report-table',
  templateUrl: './inss-report-table.component.html',
  styleUrls: ['./inss-report-table.component.scss'],
})
export class InssReportTableComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModalInss: PoModalComponent;
  @ViewChild(MessengerComponent, { static: true })
  messengerModal: MessengerComponent;
  @ViewChild(PoModalComponent, { static: true }) modalDetail: PoModalComponent;
  @ViewChild(FaqModalComponent, { static: true }) inssFaqModalComponent: FaqModalComponent;
  @Input() itemsTable: Array<ESocialBaseConferInssValuesResponse>;
  @Input() loadingTable = false;
  @Input() loadingShowMore = false;
  @Input() hasNext: boolean;
  @Input() isTAFFull: boolean;
  @Input() lotationCode: Array<string>;
  @Input() requestId: string;
  @Input() analyticalFilterParams: ExecuteAnalyticalEsocialBaseConferRequest;
  @Input() payloadGetTable: string;
  @Output('taf-showMore') showMore = new EventEmitter();

  public literals = {};
  public columns: Array<PoTableColumn>;
  public columnsBasis: Array<PoTableColumn>;
  public columnsINSS: Array<PoTableColumn>;
  public debounce: Subject<string> = new Subject<string>();
  public filter = '';
  public name: string;
  public cpfNumberFormatted: string;
  public esocialRegistration: string;
  public esocialCategory: string;
  public title: string;
  public primaryAction: PoModalAction;
  public currentParams: ESocialBaseConferRetValuesRequest;
  public menuContext: string;
  public companyId: string = this.inssReportFilterService.getCompany();
  public totalExpanded = 0;
  public inssReportItens: Array<object> = [];
  public itemsModal: Array<ESocialBaseConferInssValues>;
  public formFilterModal: UntypedFormGroup;
  public nomeModal: string;
  public cpfModal: string;
  public page = 1;
  public isLoadingButton = false;
  public itemsTableInss: Array<ESocialBaseConferInssTableItems> = [];
  public totalInssRet: string;
  public totalInss13Ret: string;
  public changeInss13Ret = false;
  public changeInssRet = false;
  public currentAnalyticsParams: ESocialBaseConferValuesRequest;
  public fabButtonPopUp: PoPopupAction[];
  public exportButtonAction: PoDropdownAction[];
  public inssFaqQuestionsSections: Array<FaqQuestionsSections>;
  public inssMoreInformations: MoreInformations;

  constructor(
    private inssReportTable: InssReportTableService,
    private literalsService: LiteralService,
    private checkFeatureService: CheckFeaturesService,
    private inssReportFilterService: InssReportFilterService,
    private exportReportFilterService: ExportExcelEsocialReportsService,
    private formBuilder: UntypedFormBuilder,
    private currencyPipe: CurrencyPipe,
    private masksPipe: MasksPipe,
    private inssReportStoreService: InssReportStoreService,
    private inssReportParamsStoreService: InssReportParamsStoreService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.setStandardFormFilterModal();
    this.inssMoreInformations = this.getInssMoreInformations();
    this.primaryAction = {
      action: () => {
        this.poModalInss.close();
      },
      label: this.literals['inssReport']['close'],
    };
    this.fabButtonPopUp = [
      { label: this.literals['inssReport']['inssInformation'] },
    ];
    this.exportButtonAction = [
      {
        icon: 'po-icon po-icon-chart-area',
        label: this.literals['inssReport']['inssAnalytic'],
        action: () => {
          this.exportReport(false, this.analyticalFilterParams);
        },
      },
      {
        icon: 'po-icon po-icon-document-filled',
        label: this.literals['inssReport']['inssSynthetic'],
        action: () => {
          this.exportReport(true);
        },
      },
    ];
    this.menuContext = sessionStorage.getItem('TAFContext');
    this.columns = this.getColumns();
    this.columnsBasis = this.getColumnsItemsInss();
    this.inssFaqQuestionsSections = this.getInssFaqQuestionsSections();

    this.debounce.pipe(debounceTime(300)).subscribe(filter => {
      this.filter = filter;
    });

    this.inssReportParamsStoreService.reportParams$.subscribe(
      params => (this.currentParams = params)
    );
  }

  private getAnalyticsParams(
    requestId: string,
    filterParams: ExecuteAnalyticalEsocialBaseConferRequest
  ): ESocialBaseConferValuesRequest {
    this.currentAnalyticsParams = {
      companyId: this.companyId,
      requestId,
      synthetic: false,
      cpfNumber: filterParams.cpfNumber,
      eSocialCategory: filterParams.eSocialCategory,
      lotationCode: filterParams.lotationCode,
      registrationNumber: filterParams.registrationNumber,
      eSocialRegistration: filterParams.eSocialRegistration,
      differencesOnly: this.currentParams.differencesOnly,
    };

    return this.currentAnalyticsParams;
  }

  private getInssMoreInformations(): MoreInformations {
    return { linkDescription: this.literals['systemInfos']['TDN'], link: 'https://tdn.totvs.com/pages/viewpage.action?pageId=528452133' };
  }

  public prepareModal({ cpfNumber }: ESocialBaseConferInssValues): void {
    this.loadingTable = true;
    this.analyticalFilterParams.cpfNumber = cpf.strip(cpfNumber);
    this.requestId = this.currentParams.requestId;

    this.inssReportTable
      .getReportModal(
        this.getAnalyticsParams(this.requestId, this.analyticalFilterParams),
        this.menuContext
      )
      .subscribe(response => {
        this.itemsModal = response.items;
        this.transformItens();
        this.modalValues();
      });

    return;
  }

  private setStandardFormFilterModal(): void {
    this.formFilterModal = this.formBuilder.group({
      modalEstablishment: [[]],
      modalPeriod: ['', Validators.required],
      modalDifferencesOnly: [''],
      modalLotation: [''],
      modalCategorie: [''],
      modalRegistration: [''],
      modalNumberOfLines: [''],
      modalCpf: ['', this.isValidCpf()],
    });
  }

  private isValidCpf(): ValidatorFn {
    return (control: AbstractControl): Validators => {
      if (control.value.length > 0) {
        return !cpf.isValid(control.value) ? { cpfNotValid: true } : null;
      }
    };
  }

  private getColumns(): Array<PoTableColumn> {
    let columnsInssValues = [
      {
        property: 'divergent',
        label: ' ',
        width: '7%',
        type: 'icon',
        icons: [
          {
            icon:
              'po-icon po-icon-exclamation font-icon-exclamation po-xl-1 po-lg-1 po-md-1 po-sm-1',
            color: 'color-07',
            tooltip: this.literals['inssReport']['divergentValues'],
            disabled: () => false,
            value: 'divergent',
          },
          {
            icon:
              'po-icon po-icon-exclamation font-icon-exclamation po-xl-1 po-lg-1 po-md-1 po-sm-1',
            color: 'color-07',
            tooltip: this.literals['inssReport']['divergentValues'],
            disabled: () => true,
            value: '',
          },
        ],
      },
      {
        property: 'cpfNumber',
        label: this.literals['inssReport']['cpf'],
        width: '15%',
        type: 'link',
        action: (value: string, item: ESocialBaseConferInssValues) => {
          this.prepareModal(item);
        },
      },
      {
        property: 'name',
        type: 'link',
        label: this.literals['inssReport']['name'],
        width: '20%',
        action: (value: string, item: ESocialBaseConferInssValues) => {
          this.prepareModal(item);
        },
      },
      {
        property: 'inssGrossValue',
        label: this.literals['inssReport']['inssGrossValue'],
      },
      {
        property: 'inssTafGrossValue',
        label: this.literals['inssReport']['inssTafGrossValue'],
      },
      {
        property: 'inssRetGrossValue',
        label: this.literals['inssReport']['inssRetGrossValue'],
      },
      {
        property: 'inssRetDescGrossValue',
        label: this.literals['inssReport']['inssRetDescGrossValue'],
      },
      {
        property: 'inss13GrossValue',
        label: this.literals['inssReport']['inss13GrossValue'],
        visible: false,
      },
      {
        property: 'inss13TafGrossValue',
        label: this.literals['inssReport']['inss13TafGrossValue'],
        visible: false,
      },
      {
        property: 'inss13RetGrossValue',
        label: this.literals['inssReport']['inss13RetGrossValue'],
        visible: false,
      },
      {
        property: 'inss13DescGrossValue',
        label: this.literals['inssReport']['inss13DescGrossValue'],
        visible: false,
      },
      {
        property: 'familySalaryValue',
        label: this.literals['inssReport']['familySalaryValue'],
        visible: false,
      },
      {
        property: 'familySalaryTafValue',
        label: this.literals['inssReport']['familySalaryTafValue'],
        visible: false,
      },
      {
        property: 'familySalaryRetValue',
        label: this.literals['inssReport']['familySalaryRetValue'],
        visible: false,
      },
      {
        property: 'maternitySalaryValue',
        label: this.literals['inssReport']['maternitySalaryValue'],
        visible: false,
      },
      {
        property: 'maternitySalaryTafValue',
        label: this.literals['inssReport']['maternitySalaryTafValue'],
        visible: false,
      },
      {
        property: 'maternitySalaryRetValue',
        label: this.literals['inssReport']['maternitySalaryRetValue'],
        visible: false,
      },
      {
        property: 'maternitySalary13Value',
        label: this.literals['inssReport']['maternitySalary13Value'],
        visible: false,
      },
      {
        property: 'maternitySalary13TafRetValue',
        label: this.literals['inssReport']['maternitySalary13TafRetValue'],
        visible: false,
      },
      {
        property: 'maternitySalary13RetValue',
        label: this.literals['inssReport']['maternitySalary13RetValue'],
        visible: false,
      },
    ];

    if (!this.isTAFFull) {
      columnsInssValues = columnsInssValues.filter(
        column =>
          !(
            column.property === 'inssTafGrossValue' ||
            column.property === 'inss13TafGrossValue' ||
            column.property === 'familySalaryTafValue' ||
            column.property === 'maternitySalaryTafValue' ||
            column.property === 'maternitySalary13TafRetValue'
          )
      );
    } else if (!this.inssReportParamsStoreService.getIsConfiguredService()) {
      columnsInssValues = columnsInssValues.filter(
        column =>
          !(
            column.property === 'inssGrossValue' ||
            column.property === 'inss13GrossValue' ||
            column.property === 'familySalaryValue' ||
            column.property === 'maternitySalaryValue' ||
            column.property === 'maternitySalary13Value'
          )
      );
    }

    return columnsInssValues;
  }

  private getColumnsItemsInss(): Array<PoTableColumn> {
    const detail: PoTableDetail = {
      typeHeader: 'top',
      columns: [
        {
          property: 'inssLabel',
          label: ' ',
          type: 'label',
        },
        {
          property: 'inssValue',
          label: this.literals['inssReport']['inssRhValueAnalytical'],
        },
        {
          property: 'inssTafValue',
          label: this.literals['inssReport']['inssTafValue'],
        },
        {
          property: 'inssRetValue',
          label: this.literals['inssReport']['inssRetValue'],
        },
      ],
    };

    if (!this.isTAFFull) {
      detail.columns = detail.columns.filter(column => {
        return column.property !== 'inssTafValue';
      });
    } else if (!this.inssReportParamsStoreService.getIsConfiguredService()) {
      detail.columns = detail.columns.filter(
        column => !(column.property === 'inssValue')
      );
    }

    return [
      {
        property: 'branchId',
        label: this.literals['inssReport']['branchId'],
      },
      {
        property: 'lotationCode',
        label: this.literals['inssReport']['lotationCode'],
      },
      {
        property: 'esocialRegistration',
        label: this.literals['inssReport']['esocialRegistration'],
      },
      {
        property: 'esocialCategory',
        label: this.literals['inssReport']['esocialCategory'],
      },
      {
        property: 'detail',
        label: 'Details',
        type: 'detail',
        detail,
      },
    ];
  }

  private modalValues(): void {
    this.title = this.literals['inssReport']['conferValuesINSS'];
    this.name = this.nomeModal;
    this.cpfNumberFormatted = this.cpfModal;
    this.poModalInss.open();
    this.loadingTable = false;
  }

  public transformItens(): void {
    this.nomeModal = this.itemsModal[0]['name'];
    this.cpfModal = this.masksPipe.cpf(this.itemsModal[0]['cpfNumber']);

    this.inssReportStoreService
      .getCurrentReportValues()
      .items.filter(item => item.cpfNumber === this.itemsModal[0]['cpfNumber'])
      .map(item => {
        this.totalInssRet = this.convertReal(item.inssRetGrossValue);
        this.totalInss13Ret = this.convertReal(item.inss13RetGrossValue);
      });

    this.itemsTableInss = this.itemsModal.map(
      (values): ESocialBaseConferInssTableItems => {
        const tableItens = {
          branchId: this.masksPipe.transform(values.branchId),
          lotationCode: values.lotationCode,
          esocialCategory: values.esocialCategory,
          esocialRegistration: values.esocialRegistration,
          detail: [
            {
              inssLabel: this.literals['inssReport']['inssBasis'],
              inssValue: this.convertReal(values.inssBasis),
              inssTafValue: this.convertReal(values.inssTafBasis),
              inssRetValue: this.convertReal(values.inssRetBasis),
            },
            {
              inssLabel: this.literals['inssReport']['inssValue'],
              inssValue: this.convertReal(values.inssValue),
              inssTafValue: this.convertReal(values.inssTafValue),
              inssRetValue: this.convertReal(values.inssRetValue),
            },
            {
              inssLabel: this.literals['inssReport']['inss13Basis'],
              inssValue: this.convertReal(values.inss13Basis),
              inssTafValue: this.convertReal(values.inss13TafBasis),
              inssRetValue: this.convertReal(values.inss13RetBasis),
            },
            {
              inssLabel: this.literals['inssReport']['inss13Value'],
              inssValue: this.convertReal(values.inss13Value),
              inssTafValue: this.convertReal(values.inss13TafValue),
              inssRetValue: this.convertReal(values.inss13RetValue),
            },
            {
              inssLabel: this.literals['inssReport'][
                'familySalaryValueAnalytical'
              ],
              inssValue: this.convertReal(values.familySalaryValue),
              inssTafValue: this.convertReal(values.familySalaryTafValue),
              inssRetValue: this.convertReal(values.familySalaryRetValue),
            },
            {
              inssLabel: this.literals['inssReport'][
                'maternitySalaryValueAnalytical'
              ],
              inssValue: this.convertReal(values.maternitySalaryValue),
              inssTafValue: this.convertReal(values.maternitySalaryTafValue),
              inssRetValue: this.convertReal(values.maternitySalaryRetValue),
            },
            {
              inssLabel: this.literals['inssReport'][
                'maternitySalary13ValueAnalytical'
              ],
              inssValue: this.convertReal(values.maternitySalary13Value),
              inssTafValue: this.convertReal(
                values.maternitySalary13TafRetValue
              ),
              inssRetValue: this.convertReal(values.maternitySalary13RetValue),
            },
          ],
        };

        if (this.isTAFFull) {
          tableItens.detail.splice(
            1,
            0,
            {
              inssLabel: this.literals['inssReport']['suspJudBasis'],
              inssValue: this.literals['inssReport']['na'],
              inssTafValue: this.literals['inssReport']['na'],
              inssRetValue: this.convertReal(values.inssRetSuspJudBasis),
            },
            {
              inssLabel: this.literals['inssReport']['inssTotalBasis'],
              inssValue: this.literals['inssReport']['na'],
              inssTafValue: this.literals['inssReport']['na'],
              inssRetValue: this.convertReal(values.inssRetTotalBasis),
            }
          );
        }

        return tableItens;
      }
    );
  }

  showMoreRegisters(sortColumn: PoTableColumnSort): void {
    this.showMore.emit();
    this.sortColumnDetail(sortColumn);
  }

  public onCollapseDetail(): void {
    this.totalExpanded -= 1;
    this.totalExpanded = this.totalExpanded < 0 ? 0 : this.totalExpanded;
  }

  public onExpandDetail(): void {
    this.totalExpanded += 1;
  }

  public async exportReport(
    synthetic: boolean,
    filterParams?: ExecuteAnalyticalEsocialBaseConferRequest
  ): Promise<void> {
    const featuresReturn = this.checkFeatureService.getFeature('downloadXLS');
    const params = synthetic
      ? this.currentParams
      : this.getAnalyticsParams(this.requestId, filterParams);

    this.isLoadingButton = true;
    this.loadingTable = true;

    if (featuresReturn.access) {
      await this.exportReportFilterService.PrintReport(
        'INSS',
        params,
        synthetic,
        this.inssReportParamsStoreService.getIsConfiguredService()
      );
    } else {
      this.messengerModal.onShowMessage(
        featuresReturn.message,
        false,
        false,
        this.literals['systemInfos']['unupdatedSystem']
      );
    }

    this.isLoadingButton = false;
    this.loadingTable = false;
  }

  private convertReal(value: number = 0): string {
    return this.currencyPipe.transform(value, 'BRL', 'symbol', '1.2-2', 'pt');
  }

  public modalInformation(): void {
    this.inssFaqModalComponent.openModal();
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

  private getInssFaqQuestionsSections(): Array<FaqQuestionsSections> {
    return [
      {
        questionSectionTitle: this.literals['inssReport']['inssSynthetic'],
        questions: [
          {
            questionTitle: this.literals['inssReport']['inssGrossValue'],
            questionAnswer: this.literals['inssReport']['inssInfoValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['inssTafGrossValue'],
            questionAnswer: this.literals['inssReport']['inssInfoTafValue'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['inssRetGrossValue'],
            questionAnswer: this.literals['inssReport']['inssInfoRetValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['inssRetDescGrossValue'],
            questionAnswer: this.literals['inssReport']['inssInfoRetDesc'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['inss13GrossValue'],
            questionAnswer: this.literals['inssReport']['inss13InfoValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['inss13TafGrossValue'],
            questionAnswer: this.literals['inssReport']['inss13InfoTafValue'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['inss13RetGrossValue'],
            questionAnswer: this.literals['inssReport']['inss13InfoRetValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['inss13DescGrossValue'],
            questionAnswer: this.literals['inssReport']['inss13InfoRetDesc'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['familySalaryValue'],
            questionAnswer: this.literals['inssReport']['inssFamilySalaryInfoValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['familySalaryTafValue'],
            questionAnswer: this.literals['inssReport']['inssFamilySalaryInfoTafValue'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['familySalaryRetValue'],
            questionAnswer: this.literals['inssReport']['inssFamilySalaryInfoRetValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['maternitySalaryValue'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalaryInfoValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['maternitySalaryTafValue'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalaryInfoTafValue'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['maternitySalaryRetValue'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalaryInfoRetValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['maternitySalary13Value'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalary13InfoValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['maternitySalary13TafRetValue'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalary13InfoTafValue'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['maternitySalary13RetValue'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalary13InfoRefValue'],
            tafFull: false,
          },
        ]
      },
      {
        questionSectionTitle: this.literals['inssReport']['inssAnalytic'],
        questions: [
          {
            questionTitle: this.literals['inssReport']['rhInssAnalyticBase'],
            questionAnswer: this.literals['inssReport']['inssAnalyticInfoBase'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['tafInssAnalyticBase'],
            questionAnswer: this.literals['inssReport']['inssAnalyticInfoTafBase'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['retInssAnalyticBase'],
            questionAnswer: this.literals['inssReport']['inssAnalyticInfoRetBase'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['rhInssAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssAnalyticInfoValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['tafInssAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssAnalyticInfoTafValue'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['retInssAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssAnalyticInfoRetValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['rhInss13AnalyticBase'],
            questionAnswer: this.literals['inssReport']['inss13AnalyticInfoBase'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['tafInss13AnalyticBase'],
            questionAnswer: this.literals['inssReport']['inss13AnalyticInfoTafBase'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['retInss13AnalyticBase'],
            questionAnswer: this.literals['inssReport']['inss13AnalyticInfoRetBase'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['rhInss13AnalyticValue'],
            questionAnswer: this.literals['inssReport']['inss13AnalyticInfoValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['tafInss13AnalyticValue'],
            questionAnswer: this.literals['inssReport']['inss13AnalyticInfoTafValue'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['retInss13AnalyticValue'],
            questionAnswer: this.literals['inssReport']['inss13AnalyticInfoRetValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['rhInssFamilySalaryAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssFamilySalaryAnalyticInfoValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['tafInssFamilySalaryAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssFamilySalaryAnalyticInfoTafValue'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['retInssFamilySalaryAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssFamilySalaryAnalyticInfoRetValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['rhInssMaternitySalaryAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalaryAnalyticInfoValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['tafInssMaternitySalaryAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalaryAnalyticInfoTafValue'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['retInssMaternitySalaryAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalaryAnalyticInfoRetValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['rhInss13MaternitySalaryAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalary13AnalyticInfoValue'],
            tafFull: false,
          },
          {
            questionTitle: this.literals['inssReport']['tafInss13MaternitySalaryAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalary13AnalyticInfoTafValue'],
            tafFull: true,
          },
          {
            questionTitle: this.literals['inssReport']['retInss13MaternitySalaryAnalyticValue'],
            questionAnswer: this.literals['inssReport']['inssMaternitySalary13AnalyticInfoRetValue'],
            tafFull: false,
          }
        ]
      }
    ];
  }
}
