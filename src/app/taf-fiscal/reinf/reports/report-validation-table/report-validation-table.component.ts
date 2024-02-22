import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {
  PoNotificationService,
  PoTableColumn,
  PoTableLiterals,
} from '@po-ui/ng-components';
import { LiteralService } from 'literals';
import { getBranchLoggedIn } from '../../../../../util/util';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { TableComponent } from './../../../../shared/table/table.component';
import { ItemTableValidation } from '../../../models/item-table-validation';
import { ItemTableSpecificEvent } from '../../../models/item-table-specific-event';
import { PayloadEventsReinf } from '../../../../models/payload-events-reinf';
import { ReportValidationTableService } from './report-validation-table.service';

@Component({
  selector: 'app-report-validation-table',
  templateUrl: './report-validation-table.component.html',
  styleUrls: ['./report-validation-table.component.scss'],
})
export class ReportValidationTableComponent implements OnInit {
  public literals: object;
  public tableColumns: Array<PoTableColumn> = [];
  public tableItems: Array<ItemTableValidation | ItemTableSpecificEvent> = [];
  public tableItemsAll: Array<ItemTableValidation | ItemTableSpecificEvent> = [];
  public loadingOverlay: boolean;
  public customLiterals: PoTableLiterals;
  public addMoreItems: number = 20; //Quantidade de itens que serão adioionados por clique no botão
  public hasNext: boolean = false;
  public pageSize: number = 20; //Quantidade de registros iniciais na página

  @Input('taf-period') period = '';
  @Input('taf-event') event = '';
  @Input('taf-path') path = '';
  @Output('taf-size-add-more') tafAddMoreEmit = new EventEmitter<number>();
  @Output('taf-hasnext') hasNextEmit = new EventEmitter<boolean>();

  @ViewChild( TableComponent ) tableComponent: TableComponent;

  constructor(
    private reportValidationTableService: ReportValidationTableService,
    private poNotificationService: PoNotificationService,
    private masksPipe: MasksPipe,
    private literalService: LiteralService
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.customLiterals = this.setCustomLiterals();
    this.getInfoTableValidationPending();
    this.tableColumns = this.report(this.event);
    //Altero a quantidade padrão do botão Carregar Mais Resultados
    this.tafAddMoreEmit.emit(this.addMoreItems);
    this.emitHasNext(this.hasNext);
  }

  public emitHasNext(hasNextParam: boolean): void {
    if(this.event.match(/R-2050|R-2055|R-2060/)) {
      if(this.tableItemsAll != null && this.tableItemsAll != undefined) {
        if(this.tableItems.length >= this.tableItemsAll.length) {
          this.hasNext = false;
        } else {
          this.hasNext = true;
        }
      } else {
        this.hasNext = false;
      }
    } else {
      this.hasNext = hasNextParam;
    }

    this.hasNextEmit.emit(this.hasNext);
  }

  public async getInfoTableValidationPending(): Promise<void> {
    const payload: PayloadEventsReinf = {
      period: this.period,
      event: this.event,
      companyId: await getBranchLoggedIn(),
      page: 1,
      pageSize: this.addMoreItems,
      routine: 'report',
    };
    this.reportValidationTableService
      .getInfoValidationPending(payload)
      .subscribe(
        response => {
          if(this.event.match(/R-2050|R-2055|R-2060/)) {
            this.setTableItem(response.eventDetail, this.hasNext);
          } else {
            this.setTableItem(response.eventDetail, response.hasNext);
          }
        },
        error => {
          this.poNotificationService.error(error);
        }
      );
  }

  public setTableItem( eventDetail: Array<any>, hasNextParam: boolean ): void {
    var items: Array<any> = [];
    var lenPage: number = 0;

    items.length = 0;
    eventDetail.forEach(item => {
      item.status = item.status ? item.status : 'notValidated';
      switch (this.event) {
        case 'R-1000':
          item.contactTaxNumberFormated = this.masksPipe.transform(
            item.contactTaxNumber
          );
          item.taxNumberFormated = this.masksPipe.transform(item.taxNumber);
          break;
        case 'R-2030':
          item.taxNumberFormated = this.masksPipe.transform(
            item.branchTaxNumber
          );
          break;
        case 'R-2040':
          item.taxNumberFormated = this.masksPipe.transform(
            item.branchTaxNumber
          );
          break;
        case 'R-3010':
          item.taxNumberPrincipal = this.masksPipe.transform(
            item.taxNumberPrincipal
          );
          item.taxNumberVisited = this.masksPipe.transform(
            item.taxNumberVisited
          );
          break;
        case 'R-4020':
          item.providerCNPJ = this.masksPipe.transform(
            item.providerCNPJ
          );
          break;
        case 'R-4040':
          item.numInsc = this.masksPipe.transform(
            item.numInsc
          );
          break;
        case 'R-4080':
          item.numInsc = this.masksPipe.transform(
            item.numInsc
          );
          break;
        case 'R-5001':
        case 'R-9001':
          item.branchTaxNumber = this.masksPipe.transform(
            item.branchTaxNumber
          );
          break;
        case 'R-9005':
          item.taxNumberBranch = this.masksPipe.transform(
              item.taxNumberBranch
            );
            break;
        case 'R-5011':
        case 'R-9011':
          item.branchTaxNumber = this.masksPipe.transform(
              item.branchTaxNumber
            );
            break;
        case 'R-4010':
          item.taxNumberFormated = this.masksPipe.transform(
            item.branchTaxNumber
          );
          break;
        default:
          item.taxNumberFormated = this.masksPipe.transform(item.taxNumber);
          break;
      }
      items.push(item);
    });

    this.tableItemsAll = items;

    if(this.event.match(/R-2050|R-2055|R-2060/)) {
      lenPage = this.pageSize;
    } else {
      lenPage = items.length;
    }

    if(this.tableItemsAll != null && this.tableItemsAll != undefined) {
      if(this.tableItemsAll.length > 0) {
        this.tableItems = this.tableItemsAll.slice(0, lenPage);
      } else {
        this.tableItems = [];
      }
    }

    this.emitHasNext(hasNextParam);
    this.tableComponent.hasNext = hasNextParam;
  }

  public showDetails(): boolean {
    return this.event.match('R-1000|R-2055|R-4040') ? false : true;
  }

  public setCustomLiterals(): PoTableLiterals {
    return this.literals['table']['dataNotFound'];
  }

  public report(event: string): Array<PoTableColumn> {
    let eventFunctionName :string;
    let codEvent : string;

    if ( event.match(/R-9001|R-9011/) ) {
      codEvent = event.replace(/9/g,'5');
    } else {
      codEvent = event;
    }

    eventFunctionName = codEvent.replace(/-/g, '_');

    if (event.match(/R-[0-9]{4}$/)) {
      const eventFunction = this[eventFunctionName]();
      return eventFunction;
    } else {
      return [];
    }
  }

  public R_1000(): Array<PoTableColumn> {
    return [
      {
        property: 'branch',
        label: this.literals['table']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'typeOfInscription',
        label: this.literals['table']['typeOfInscription'],
        width: '9%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['table']['taxNumber'],
        width: '8%',
      },
      {
        property: 'beginingDate',
        label: this.literals['table']['beginingDate'],
        width: '8%',
      },
      {
        property: 'finishingdate',
        label: this.literals['table']['finishingdate'],
        width: '8%',
      },
      {
        property: 'taxClassification',
        label: this.literals['table']['taxClassification'],
        width: '12%',
      },
      {
        property: 'isMandatoryBookkeeping',
        label: this.literals['table']['isMandatoryBookkeeping'],
        width: '12%',
      },
      {
        property: 'isPayrollExemption',
        label: this.literals['table']['isPayrollExemption'],
        width: '13%',
      },
      {
        property: 'hasFineExemptionAgreement',
        label: this.literals['table']['hasFineExemptionAgreement'],
        width: '12%',
      },
      {
        property: 'contact',
        label: this.literals['table']['contact'],
        width: '12%',
      },
      {
        property: 'contactTaxNumberFormated',
        label: this.literals['table']['contactTaxNumber'],
        width: '8%',
      },
    ];
  }

  public R_1070(): Array<PoTableColumn> {
    return [
      {
        property: 'proccesType',
        label: this.literals['table']['proccesType'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'proccesNumber',
        label: this.literals['table']['proccesNumber'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'courtFederatedUnit',
        label: this.literals['table']['courtFederatedUnit'],
        type: 'string',
        width: '10%',
      },
      {
        property: 'cityCode',
        label: this.literals['table']['cityCode'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'courtId',
        label: this.literals['table']['courtId'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'beginingDate',
        label: this.literals['table']['beginingOfValidity'],
        type: 'string',
        width: '10%',
      },
      {
        property: 'finishingDate',
        label: this.literals['table']['finishingOfValidity'],
        type: 'string',
        width: '10%',
      },
    ];
  }

  public R_2010(): Array<PoTableColumn> {
    return [
      {
        property: 'branch',
        label: this.literals['table']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['table']['companyTaxNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'company',
        label: this.literals['table']['company'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'totalInvoice',
        label: this.literals['table']['totalInvoice'],
        width: '10%',
        type: 'number',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxBase',
        label: this.literals['table']['totalTaxBase'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxes',
        label: this.literals['table']['totalTaxes'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2020(): Array<PoTableColumn> {
    return [
      {
        property: 'branch',
        label: this.literals['table']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['table']['companyTaxNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'company',
        label: this.literals['table']['company'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'totalInvoice',
        label: this.literals['table']['totalInvoice'],
        width: '10%',
        type: 'number',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxBase',
        label: this.literals['table']['totalTaxBase'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxes',
        label: this.literals['table']['totalTaxes'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2030(): Array<PoTableColumn> {
    return [
      {
        property: 'branch',
        label: this.literals['table']['branch'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['table']['branchTaxNumber'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'company',
        label: this.literals['table']['company'],
        type: 'string',
        width: '30%',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2040(): Array<PoTableColumn> {
    return [
      {
        property: 'branch',
        label: this.literals['table']['branch'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['table']['branchTaxNumber'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'company',
        label: this.literals['table']['company'],
        type: 'string',
        width: '30%',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2050(): Array<PoTableColumn> {
    return [
      {
        property: 'branch',
        label: this.literals['table']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['table']['registrationNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'company',
        label: this.literals['table']['company'],
        type: 'string',
        width: '20%',
      },
    ];
  }

  public R_2055(): Array<PoTableColumn> {
    return [
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        /*width: '8%',*/
      },
      {
        property: 'inscriptionAcq',
        label: this.literals['table']['inscriptionAcq'],
        type: 'number',
        width: '10%',
      },
      /*
      {
        property: 'typeOfInscription',
        label: this.literals['table']['typeOfInscription'],
        type: 'string',
        /*width: '15%',*/
      //},

      {
        property: 'totalProviders',
        label: this.literals['table']['totalProviders'],
        type: 'number',
        /*width: '15%',*/
      },
      {
        property: 'totalOutProviders',
        label: this.literals['table']['totalOutProviders'],
        type: 'number',
        /*width: '15%',*/
      },
      {
        property: 'totalDocs',
        label: this.literals['table']['totalDocs'],
        type: 'number',
        /*width: '20%',*/
      },
      /*{
        property: 'totalInvoice',
        label: this.literals['table']['totaldocs'],
        width: '10%',
        type: 'number',
      },*/

      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        /*width: '10%',*/
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'valueGilRat',
        label: this.literals['table']['sociaSecurityContributionValueGilrat'],
        /*width: '10%',*/
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'valueSenar',
        label: this.literals['table']['sociaSecurityContributionValueSenar'],
        /*width: '10%',*/
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'valueINSS',
        label: this.literals['table']['totalINSS'],
        /*width: '10%',*/
        type: 'number',
        format: '1.2-5',
      },
    ];
  }
  public R_4010(): Array<PoTableColumn> {
    return [
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        width: '14%',
      },
      {
        property: 'providerCPF',
        label: this.literals['table']['providerCPF'],
        type: 'number',
        width: '14%',
      },
      {
        property: 'providerName',
        label: this.literals['table']['providerName'],
        type: 'string',
        width: '16%',
      },
      {
        property: 'grossAmount',
        label: this.literals['table']['grossAmount'],
        type: 'number',
        width: '14%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxBase',
        label: this.literals['table']['incomeTaxBase'],
        type: 'number',
        width: '14%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxAmount',
        label: this.literals['table']['incomeTaxAmount'],
        type: 'number',
        width: '14%',
        format: '1.2-5',
      },
      {
        property: 'totalDocs',
        label: this.literals['table']['totalDocs'],
        type: 'number',
        width: '14%',
      },
    ];
  }

  public R_4020(): Array<PoTableColumn> {
    return [
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        width: '9%',
      },
      {
        property: 'providerCNPJ',
        label: this.literals['table']['providerCNPJ'],
        type: 'number',
        width: '14%',
      },
      {
        property: 'providerName',
        label: this.literals['table']['providerName'],
        type: 'string',
        width: '21%',
      },
      {
        property: 'totalDocs',
        label: this.literals['table']['totalDocs'],
        type: 'number',
        width: '8%',
      },
      {
        property: 'grossAmount',
        label: this.literals['table']['grossAmount'],
        type: 'number',
        width: '8%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxBase',
        label: this.literals['table']['incomeTaxBase'],
        type: 'number',
        width: '8%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxAmount',
        label: this.literals['table']['incomeTaxAmount'],
        type: 'number',
        width: '8%',
        format: '1.2-5',
      },
      {
        property: 'pisValue',
        label: this.literals['table']['pisValue'],
        type: 'number',
        width: '8%',
        format: '1.2-5',
      },
      {
        property: 'cofinsValue',
        label: this.literals['table']['cofinsValue'],
        type: 'number',
        width: '8%',
        format: '1.2-5',
      },
      {
        property: 'csllValue',
        label: this.literals['table']['csllValue'],
        type: 'number',
        width: '8%',
        format: '1.2-5',
      },
      {
        property: 'agregValue',
        label: this.literals['table']['agregValue'],
        type: 'number',
        width: '8%',
        format: '1.2-5',
      }
    ];
  }

  public R_4040(): Array<PoTableColumn> {
    return [
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        width: '12%',
      },
      {
        property: 'numInsc',
        label: this.literals['table']['registrationNumber'],
        type: 'number',
        width: '15%',
      },
      {
        property: 'company',
        label: this.literals['table']['company'],
        type: 'string',
        width: '40%',
      },
      {
        property: 'liquidValue',
        label: this.literals['table']['liquidValue'],
        type: 'number',
        width: '11%',
        format: '1.2-5',
      },
      {
        property: 'irBaseValue',
        label: this.literals['table']['incomeTaxBase'],
        type: 'number',
        width: '11%',
        format: '1.2-5',
      },
      {
        property: 'irValue',
        label: this.literals['table']['incomeTaxAmount'],
        type: 'number',
        width: '11%',
        format: '1.2-5',
      },
    ];
  }

  public R_4080(): Array<PoTableColumn> {
    return [
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        width: '12%',
      },
      {
        property: 'numInsc',
        label: this.literals['table']['registrationNumber'],
        type: 'number',
        width: '15%',
      },
      {
        property: 'fontName',
        label: this.literals['table']['fontName'],
        type: 'string',
        width: '40%',
      },
      {
        property: 'liquidValue',
        label: this.literals['table']['grossAmount'],
        type: 'number',
        width: '11%',
        format: '1.2-5',
      },
      {
        property: 'irBaseValue',
        label: this.literals['table']['incomeTaxBase'],
        type: 'number',
        width: '11%',
        format: '1.2-5',
      },
      {
        property: 'irValue',
        label: this.literals['table']['incomeTaxAmount'],
        type: 'number',
        width: '11%',
        format: '1.2-5',
      },
    ];
  }

  public R_5001(): Array<PoTableColumn> {
    return [
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'branchTaxNumber',
        label: this.literals['table']['branchTaxNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'companyName',
        label: this.literals['table']['branch'],
        type: 'string',
        width: '70%',
      },
    ];
  }

  public R_9005(): Array<PoTableColumn> {
    return [
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'taxNumberBranch',
        label: this.literals['table']['branchTaxNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'companyName',
        label: this.literals['table']['branch'],
        type: 'string',
        width: '70%',
      },
    ];
  }

  public R_5011(): Array<PoTableColumn> {
    return [
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
      },
      {
        property: 'branchTaxNumber',
        label: this.literals['table']['branchTaxNumber'],
        type: 'string',
      },
      {
        property: 'companyName',
        label: this.literals['table']['branch'],
        type: 'string',
      },
      {
        property: 'receipt',
        label: this.literals['table']['receipt'],
        type: 'string',
      },
    ];
  }

  public R_2060(): Array<PoTableColumn> {
    return [
      {
        property: 'typeOfInscription',
        label: this.literals['table']['typeOfInscription'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['table']['companyTaxNumber'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'totalInvoice',
        label: this.literals['table']['totalInvoice'],
        width: '10%',
        type: 'number',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        width: '15%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValue',
        label: this.literals['table']['sociaSecurityContributionValue'],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValueSuspended',
        label: this.literals['table'][
          'sociaSecurityContributionValueSuspended'
        ],
        width: '10%',
        type: 'number',
        format: '1.2-5',
        visible: false,
      },
    ];
  }

  public R_3010(): Array<PoTableColumn> {
    return [
      {
        property: 'branch',
        label: this.literals['table']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'newsletterNumber',
        label: this.literals['table']['newsletterNumber'],
        type: 'number',
        width: '10%',
      },
      {
        property: 'mode',
        label: this.literals['table']['mode'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'competition',
        label: this.literals['table']['competition'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'taxNumberPrincipal',
        label: this.literals['table']['taxNumberPrincipal'],
        width: '20%',
        visible: false,
      },
      {
        property: 'taxNumberVisited',
        label: this.literals['table']['taxNumberVisited'],
        type: 'string',
        width: '20%',
        visible: false,
      },
      {
        property: 'payingOffValue',
        label: this.literals['table']['payingOffValue'],
        type: 'number',
        width: '10%',
      },
      {
        property: 'dontPayingOffValue',
        label: this.literals['table']['dontPayingOffValue'],
        type: 'number',
        width: '10%',
      },
      {
        property: 'grossValue',
        label: this.literals['table']['grossValue'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'contributionValue',
        label: this.literals['table']['contributionValue'],
        type: 'number',
        format: '1.2-5',
        width: '10%',
      },
      {
        property: 'contributionValueSuspended',
        label: this.literals['table']['contributionValueSuspended'],
        type: 'number',
        format: '1.2-5',
        visible: false,
        width: '15%',
      },
    ];
  }
  public R_9015(): Array<PoTableColumn> {
    return [
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'branchTaxNumber',
        label: this.literals['table']['branchTaxNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'companyName',
        label: this.literals['table']['branch'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'protocol',
        label: this.literals['table']['protocol'],
        type: 'string',
        width: '50%',
      },
    ];
  }
}
