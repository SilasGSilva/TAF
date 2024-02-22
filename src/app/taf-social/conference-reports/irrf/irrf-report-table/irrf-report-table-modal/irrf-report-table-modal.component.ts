import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { PoModalAction, PoModalComponent, PoTableColumn, PoTableDetail } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { IFaqModal } from 'shared/faq-modal/ifaq-modal';
import { FaqModalComponent } from 'shared/faq-modal/faq-modal.component';
import { FaqQuestionsSections } from './../../../../../models/faq-questions-sections';
import { FaqProperties } from '../../../../../models/faq-properties';
import { IRAnalyticalEmployee } from '../../irrf-models/IRAnalyticalEmployee';
import { IRAnalyticalTableValues } from '../../irrf-models/IRAnalyticalTableValues';
import { IRValueTypes } from '../../irrf-models/IRValueTypes';
import { IrrfReportParamsStoreService } from '../../../services/stores/irrf/irrf-report-params-store/irrf-report-params-store.service';

@Component({
  selector: 'app-irrf-report-table-modal',
  templateUrl: './irrf-report-table-modal.component.html',
  styleUrls: ['./irrf-report-table-modal.component.scss']
})
export class IrrfReportTableModalComponent implements OnInit, IFaqModal {
  @ViewChild(PoModalComponent, { static: true }) reportIrrfModal: PoModalComponent;
  @ViewChild(FaqModalComponent, { static: true }) irrfFaqModalComponent: FaqModalComponent;

  @Input('is-taf-full') isTAFFull: boolean;
  @Output('export-report') exportReport = new EventEmitter<{
    cpfNumber: string; 
    demonstrativeId: Array<string>
  }>();

  public literals = {};
  public primaryAction: PoModalAction;
  public columns: Array<PoTableColumn>;
  public name: string;
  public cpfNumber: string;
  public employeeAnalyticalData: IRAnalyticalEmployee;
  public itemsModal: Array<IRAnalyticalTableValues>;
  public faqModal: FaqProperties;
  private typesIrrfValuesDesc: IRValueTypes;

  constructor(
    private literalsService: LiteralService,
    private irrfReportParamsStoreService: IrrfReportParamsStoreService,
  ) {
    this.literals = this.literalsService.literalsTafSocial;
   }

  ngOnInit(): void {
    this.primaryAction = {
      action: () => {
        this.reportIrrfModal.close();
      },
      label: this.literals['irrfReport']['close'],
    };
    this.columns = this.getColumns();
    this.typesIrrfValuesDesc = this.getTypesIrrfValuesDesc();
    this.faqModal = {
      title: this.literals['irrfReport']['irrfTitleFaqAnalytical'],
      summary: this.literals['irrfReport']['irrfFaqAnalytical'],
      questions: this.getFaqQuestionsSections(),
      buttonPopUp: [{ label: this.literals['irrfReport']['irrfInformation'] }],
      moreInformations: {
        linkDescription: this.literals['irrfReport']['esocialTechnicalDoc'],
        link: 'https://www.gov.br/esocial/pt-br/documentacao-tecnica/leiautes-esocial-v-1.2/'
      }
    }
    this.employeeAnalyticalData = {
      cpfNumber: '',
      demonstrativeId: [],
      name: '',
      typesIrrfValues: {}
    }
  }

  public openModal(chosenEmployee: IRAnalyticalEmployee): void {
    this.employeeAnalyticalData = chosenEmployee;
    this.itemsModal = Object.entries(this.employeeAnalyticalData.typesIrrfValues).map((value) => {
      return {
        irrfValueTypeDesc: this.typesIrrfValuesDesc[value[0]], 
        irrfInfo: [
          ...value[1].items, 
          { type: this.literals['irrfReport']['total'], ...value[1].total }
        ]
      }
    });

    this.reportIrrfModal.open();
  }

  public exportAnalyticalreport(): void {
      this.exportReport.emit({
        cpfNumber: this.employeeAnalyticalData.cpfNumber,
        demonstrativeId: this.employeeAnalyticalData.demonstrativeId
      });
  }

  public openModalFAQ(): void {
    this.irrfFaqModalComponent.openModal();
  }

  private getColumns(): Array<PoTableColumn> {
    const detailColumns: PoTableDetail = {
      columns: [
        {
          property: 'type',
          label: this.literals['irrfReport']['type']
        },
        {
          property: 'descriptionType',
          label: this.literals['irrfReport']['descriptionType']
        },
        {
          property: 'tafValue',
          label: this.literals['irrfReport']['tafValues'],
          type: 'currency',
          format: 'BRL'
        },
        {
          property: 'erpValue',
          label: this.literals['irrfReport']['rhValues'],
          type: 'currency',
          format: 'BRL'
        },
        {
          property: 'retValue',
          label: this.literals['irrfReport']['govValues'],
          type: 'currency',
          format: 'BRL'
        }
      ],
      typeHeader: 'top'
    };
    const columns: Array<PoTableColumn> = [
      {
        property: 'irrfValueTypeDesc',
        label: this.literals['irrfReport']['IRRFvaluesConsolidation']
      },
      { 
        property: 'irrfInfo', 
        label: 'Details', 
        type: 'detail', 
        detail: detailColumns 
      }
    ];

    if (!this.isTAFFull) {
      detailColumns.columns = detailColumns.columns.filter(itemColumnDetail => !(itemColumnDetail.property === 'tafValue'));
    } else if (!this.irrfReportParamsStoreService.getIsConfiguredService()) {
      detailColumns.columns = detailColumns.columns.filter(itemColumnDetail => !(itemColumnDetail.property === 'erpValue'));
    }

    return columns;
  }

  private getTypesIrrfValuesDesc(): IRValueTypes {
    return {
      taxableIncome: this.literals['irrfReport']['taxableIncome'],
      nonTaxableIncome: this.literals['irrfReport']['nonTaxableIncome'],
      retention: this.literals['irrfReport']['retention'],
      deductions: this.literals['irrfReport']['deductions'],
      taxableIncomeSuspended: this.literals['irrfReport']['taxableIncomeSuspended'],
      retentionSuspended: this.literals['irrfReport']['retentionSuspended'],
      deductionsSuspended: this.literals['irrfReport']['deductionsSuspended'],
      judicialCompensation: this.literals['irrfReport']['judicialCompensation']
    }
  }

  public getFaqQuestionsSections(): Array<FaqQuestionsSections> {
    return [
      {
        questionSectionTitle: this.literals['irrfReport']['IRRFvaluesComposition'],
        questions: [
          {
            questionTitle: this.literals['irrfReport']['taxableIncome'],
            questionAnswer: this.literals['irrfReport']['taxableIncomeComposition'],
            tafFull: true
          },
          {
            questionTitle: this.literals['irrfReport']['nonTaxableIncome'],
            questionAnswer: this.literals['irrfReport']['nonTaxableIncomeComposition'],
            tafFull: true
          },
          {
            questionTitle: this.literals['irrfReport']['retention'],
            questionAnswer: this.literals['irrfReport']['retentionComposition'],
            tafFull: true
          },
          {
            questionTitle: this.literals['irrfReport']['deductions'],
            questionAnswer: this.literals['irrfReport']['deductionsComposition'],
            tafFull: true
          },
          {
            questionTitle: this.literals['irrfReport']['taxableIncomeSuspended'],
            questionAnswer: this.literals['irrfReport']['taxableIncomeSuspendedComposition'],
            tafFull: true
          },
          {
            questionTitle: this.literals['irrfReport']['retentionSuspended'],
            questionAnswer: this.literals['irrfReport']['retentionSuspendedComposition'],
            tafFull: true
          },
          {
            questionTitle: this.literals['irrfReport']['deductionsSuspended'],
            questionAnswer: this.literals['irrfReport']['deductionsSuspendedComposition'],
            tafFull: true
          },
          {
            questionTitle: this.literals['irrfReport']['judicialCompensation'],
            questionAnswer: this.literals['irrfReport']['judicialCompensationComposition'],
            tafFull: true
          }
        ],
      }
    ];
  }
}