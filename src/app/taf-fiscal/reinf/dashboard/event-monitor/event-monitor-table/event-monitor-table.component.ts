import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  OnChanges,
  EventEmitter,
} from '@angular/core';

import { PoNotificationService, PoTableColumn } from '@po-ui/ng-components';

import { MasksPipe } from 'shared/pipe/masks.pipe';
import { LiteralService } from 'core/i18n/literal.service';
import { EventMonitorTableService } from './event-monitor-table.service';
import { EventErrorMessageComponent } from 'shared/event-error-message/event-error-message.component';
import { EventMonitor } from '../../../../models/event-monitor';
import { ItemTableMonitor } from '../../../../models/item-table-monitor';
import { ItemTableTaxPayer } from './item-table-tax-payer';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableEventByTheSportsAssociation } from '../../../../models/item-table-event-by-the-sports-association';
import { ItemTableSociaSecurityContribution } from './item-table-socia-security-contribution';
import { ItemTableResourcesReceivedByTheSportsAssociation } from './item-table-resources-received-by-the-sports-association';
import { getBranchLoggedIn } from '../../../../../../util/util';
import { ItemTable } from 'taf-fiscal/models/item-table';
import { ItemTableSocialSecurityContribution } from 'taf-fiscal/models/item-table-social-security-contribution';
import { ItemTableSpecificEvent } from 'taf-fiscal/models/item-table-specific-event';
import { ListEventsDelete } from 'taf-fiscal/models/list-events-delete';
import { ListEventsRelay } from 'taf-fiscal/models/list-events-relay';

@Component({
  selector: 'app-event-monitor-table',
  templateUrl: './event-monitor-table.component.html',
  styleUrls: ['./event-monitor-table.component.scss'],
  providers: [MasksPipe],
})
export class EventMonitorTableComponent implements OnInit, OnChanges {
  public literals = {};
  public eventDetail: Array<
    | ItemTableMonitor
    | ItemTableTaxPayer
    | ItemTableProcess
    | ItemTableResourcesReceivedByTheSportsAssociation
    | ItemTableMarketingByFarmer
    | ItemTableSociaSecurityContribution
    | ItemTableEventByTheSportsAssociation
  > = [];
  public eventDetailAll: Array<
    | ItemTableMonitor
    | ItemTableTaxPayer
    | ItemTableProcess
    | ItemTableResourcesReceivedByTheSportsAssociation
    | ItemTableMarketingByFarmer
    | ItemTableSociaSecurityContribution
    | ItemTableEventByTheSportsAssociation
  > = [];
  public tableColumns: Array<PoTableColumn> = [];
  public tableLoad = false;
  public loadingTable = false;
  public currentStatus = 'transmitted';
  public enableCheck  = true;
  public isDisableButton = true;
  public EVENTS_REINF_DELETE = ListEventsDelete;
  public EVENTS_REINF_RELAY = ListEventsRelay;
  public pageSize:number = 40;      //Quantidade de registros iniciais na página
  public addMoreItems:number = 10;  //Quantidade de itens que serão adioionados por clique no botão
  public hasNext:boolean = false;

  @Input('taf-status') status = '';
  @Input('taf-branch') companyId: string;
  @Input('taf-event') event = '';
  @Input('taf-period') period = '';

  @Output('taf-errorId') errorId: string;
  @Output('taf-size-add-more') tafAddMoreEmit = new EventEmitter<number>();
  @Output('taf-hasnext') hasNextEmit = new EventEmitter<boolean>();
  @Output('taf-button-emit') buttonEmit = new EventEmitter<boolean>();
  @Output('taf-selected-entry') selectedEntry = new EventEmitter<
    Array<
      | ItemTable
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContribution
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTableEventByTheSportsAssociation
    >
  >();

  @ViewChild(EventErrorMessageComponent)
  eventErrorMessage: EventErrorMessageComponent;

  constructor(
    private masksPipe: MasksPipe,
    private literalService: LiteralService,
    private eventMonitorTableService: EventMonitorTableService,
    private poNotificationService: PoNotificationService
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.loadTable();
    this.emitButtonActivate(this.isDisableButton);
  }

  ngOnChanges(): void {
    if (this.currentStatus !== this.status) {
      this.loadTable();
      this.emitButtonActivate(this.isDisableButton);
    }
  }

  public loadTable(): void {
    this.setTableLoad(true);
    this.currentStatus = this.status;
    this.tableColumns = this.monitoring(this.event);
    this.getInfoEventMonitor();
    //Altero a quantidade padrão do botão Carregar Mais Resultados
    this.tafAddMoreEmit.emit(this.addMoreItems);
    this.emitHasNext();
  }

  public async getInfoEventMonitor(): Promise<void> {
    const eventMonitor: EventMonitor = {
      companyId: await getBranchLoggedIn(),
      status: this.status,
      event: this.event,
      period: this.period,
    };

    this.setTableLoad(true);
    this.eventMonitorTableService.getInfoEventMonitor(eventMonitor).subscribe(
      response => {
        this.setTableItems(this.setItems(response.eventDetail));
        this.setTableLoad(false);
      },
      error => {
        this.poNotificationService.error(error);
        this.setTableLoad(false);
      }
    );
  }

  public showError(
    items:
      | ItemTableMonitor
      | ItemTableTaxPayer
      | ItemTableProcess
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTableMarketingByFarmer
      | ItemTableSociaSecurityContribution
      | ItemTableEventByTheSportsAssociation
  ): void {
    this.eventErrorMessage.errorDetail(items.errorId);
  }

  public setItems(
    items
  ): Array<
    | ItemTableMonitor
    | ItemTableTaxPayer
    | ItemTableProcess
    | ItemTableResourcesReceivedByTheSportsAssociation
    | ItemTableMarketingByFarmer
    | ItemTableSociaSecurityContribution
    | ItemTableEventByTheSportsAssociation
  > {
    const itemsTable = [];

    items.forEach(item => {
      switch (this.event) {
        case 'R-1000':
          item.contactTaxNumberFormated = this.masksPipe.transform(
            item.contactTaxNumber
          );
          break;
        case 'R-1050':
          item.cnpj = this.masksPipe.transform(
            item.cnpj
          );
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
        case 'R-2060':
          item.taxNumberFormated = this.masksPipe.transform(
            item.companyTaxNumber
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
        case 'R-4010':
          item.providerCPF = this.masksPipe.transform(
            item.providerCPF
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
        default:
          item.taxNumberFormated = this.masksPipe.transform(item.taxNumber);
          break;
      }

      item.errors = this.literals['eventMonitorTable']['errors'];

      itemsTable.push(item);
    });

    return itemsTable;
  }
  public setTableLoad(status: boolean): void {
    this.tableLoad = status;
    this.loadingTable = status;
  }

  public setTableItems(items): void {
    this.eventDetail = items;
    this.eventDetailAll = items;
    if (this.eventDetailAll != null && this.eventDetailAll != undefined){
      if (this.eventDetailAll.length > 0){
        this.eventDetail = this.eventDetailAll.slice(0,this.pageSize);
      }else{
        this.eventDetail = [];
      }
    }
    this.emitHasNext();
  }

  public emitHasNext(): void {
    if (this.eventDetailAll != null && this.eventDetailAll != undefined){
        if (this.eventDetail.length >= this.eventDetailAll.length){
          this.hasNext = false;
        }else{
          this.hasNext = true;
        }
    }else{
      this.hasNext = false;
    }
    this.hasNextEmit.emit(this.hasNext);
  }

  public monitoring(event: string): Array<PoTableColumn> {
    const eventFunctionName = event.replace(/-/g, '_');

    if (event.match(/R-[0-9]{4}$/)) {
      const columns = this[eventFunctionName]();

      if (this.status === 'authorized') {
        if (this.event != 'R-9000') {
          columns.push({
            property: 'protocol',
            label: this.literals['table']['protocol'],
            width: '15%',
          });
        }
      } else if (this.status === 'rejected') {
        columns.push({
          property: 'errors',
          label: this.literals['table']['errors'],
          width: '7%',
          type: 'icon',
          icons: [
            {
              action: this.showError.bind(this),
              icon: 'po-icon po-icon-exclamation',
              color: 'color-07',
              tooltip: this.literals['table']['detail'],
              value: 'Erros',
            },
          ],
        });
      }
      return columns;
    } else {
      return [];
    }
  }

  public R_1000(): Array<PoTableColumn> {
    return [
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
      },
      {
        property: 'proccesNumber',
        label: this.literals['table']['proccesNumber'],
        type: 'string',
      },
      {
        property: 'courtFederatedUnit',
        label: this.literals['table']['courtFederatedUnit'],
        type: 'string',
      },
      {
        property: 'cityCode',
        label: this.literals['table']['cityCode'],
        type: 'string',
      },
      {
        property: 'courtId',
        label: this.literals['table']['courtId'],
        type: 'string',
      },
      {
        property: 'beginingDate',
        label: this.literals['table']['beginingOfValidity'],
        type: 'string',
      },
      {
        property: 'finishingDate',
        label: this.literals['table']['finishingOfValidity'],
        type: 'string',
      },
    ];
  }

  public R_1050(): Array<PoTableColumn> {
    return [
      {
        property: 'tpEntLig',
        label: this.literals['table']['tpEntLig'],
        type: 'string',
        width: '50%',
      },
      {
        property: 'cnpj',
        label: this.literals['table']['providerCNPJ'],
        type: 'string',
        width: '50%',
      }
    ];
  }

  public R_2010(): Array<PoTableColumn> {
    return [
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
        property: 'taxNumberFormated',
        label: this.literals['table']['branchTaxNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'company',
        label: this.literals['table']['company'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalReceivedWithHoldAmount',
        label: this.literals['table']['totalReceivedWithHoldAmount'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalValueOfRetentionWithSuspendedLiability',
        label: this.literals['table'][
          'totalValueOfRetentionWithSuspendedLiability'
        ],
        width: '10%',
        type: 'number',
        format: '1.2-5',
        visible: false,
      },
    ];
  }

  public R_2040(): Array<PoTableColumn> {
    return [
      {
        property: 'taxNumberFormated',
        label: this.literals['table']['branchTaxNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'company',
        label: this.literals['table']['company'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalReceivedWithHoldAmount',
        label: this.literals['table']['totalReceivedWithHoldAmount'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalValueOfRetentionWithSuspendedLiability',
        label: this.literals['table'][
          'totalValueOfRetentionWithSuspendedLiability'
        ],
        width: '10%',
        type: 'number',
        format: '1.2-5',
        visible: false,
      },
    ];
  }

  public R_2050(): Array<PoTableColumn> {
    return [
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
      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValue',
        label: this.literals['table']['sociaSecurityContributionValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValueGilrat',
        label: this.literals['table']['sociaSecurityContributionValueGilrat'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValueSenar',
        label: this.literals['table']['sociaSecurityContributionValueSenar'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2055(): Array<PoTableColumn> {
    return [

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
      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValueGilrat',
        label: this.literals['table']['sociaSecurityContributionValueGilrat'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValueSenar',
        label: this.literals['table']['sociaSecurityContributionValueSenar'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'contributionValue',
        label: this.literals['table']['contributionValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },

    ];
  }

  public R_2060(): Array<PoTableColumn> {
    return [
      {
        property: 'typeOfInscription',
        label: this.literals['table']['typeOfInscription'],
        width: '9%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['table']['companyTaxNumber'],
        width: '8%',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValue',
        label: this.literals['table']['sociaSecurityContributionValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'socialSecurityContributionValueSuspended',
        label: this.literals['table'][
          'socialSecurityContributionValueSuspended'
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
        width: '10%',
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

  public R_4010(): Array<PoTableColumn> {
    return [
      {
        property: 'providerCPF',
        label: this.literals['table']['taxNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'providerName',
        label: this.literals['table']['company'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'grossAmount',
        label: this.literals['table']['grossAmount'],
        type: 'number',
        width: '15%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxBase',
        label: this.literals['table']['incomeTaxBase'],
        type: 'number',
        width: '15%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxAmount',
        label: this.literals['table']['incomeTaxAmount'],
        type: 'number',
        width: '15%',
        format: '1.2-5',
      }
    ];
  }

  public R_4020(): Array<PoTableColumn> {
    return [
      {
        property: 'providerCNPJ',
        label: this.literals['table']['providerCNPJ'],
        type: 'number',
        width: '12%',
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
        width: '12%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxBase',
        label: this.literals['table']['incomeTaxBase'],
        type: 'number',
        width: '12%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxAmount',
        label: this.literals['table']['incomeTaxAmount'],
        type: 'number',
        width: '12%',
        format: '1.2-5',
      },
      {
        property: 'pisValue',
        label: this.literals['table']['pisValue'],
        type: 'number',
        width: '12%',
        format: '1.2-5',
      },
      {
        property: 'cofinsValue',
        label: this.literals['table']['cofinsValue'],
        type: 'number',
        width: '12%',
        format: '1.2-5',
      },
      {
        property: 'csllValue',
        label: this.literals['table']['csllValue'],
        type: 'number',
        width: '12%',
        format: '1.2-5',
      },
      {
        property: 'agregValue',
        label: this.literals['table']['agregValue'],
        type: 'number',
        width: '12%',
        format: '1.2-5',
      }
    ];
  }

  public R_4040(): Array<PoTableColumn> {
    return [
      {
        property: 'numInsc',
        label: this.literals['table']['providerCNPJ'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'company',
        label: this.literals['table']['company'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'liquidValue',
        label: this.literals['table']['liquidValue'],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'irBaseValue',
        label: this.literals['table']['incomeTaxBase'],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'irValue',
        label: this.literals['table']['incomeTaxAmount'],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      }
    ];
  }

  public R_4080(): Array<PoTableColumn> {
    return [
      {
        property: 'numInsc',
        label: this.literals['table']['providerCNPJ'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'fontName',
        label: this.literals['table']['fontName'],
        type: 'string',
        width: '25%',
      },
      {
        property: 'grossAmount',
        label: this.literals['table']['grossAmount'],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'irBaseValue',
        label: this.literals['table']['incomeTaxBase'],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'irValue',
        label: this.literals['table']['incomeTaxAmount'],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      }
    ];
  }

  public R_9000(): Array<PoTableColumn> {
    return [
      {
        property: 'branch',
        label: this.literals['table']['branch'],
        type: 'string',
        width: '25%',
      },
      {
        property: 'event',
        label: this.literals['table']['event'],
        type: 'string',
        width: '25%',
      },
      {
        property: 'protocol',
        label: this.literals['table']['protocol'],
        width: '50%',
        type: 'string',
      }
    ];
  }

  public onSelectionChange(
    selectedEntry: Array<
      | ItemTable
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContribution
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTableEventByTheSportsAssociation
    >
  ): void {
    if (selectedEntry.length) {
      const validEntires = this.validSelectedEntryes(selectedEntry);
      if (validEntires.length === selectedEntry.length) {
        this.isDisableButton = false;
        this.emitSelectedEntry(validEntires);
      } else {
        /*selectedEntry.forEach(register => {
          if (register.status === 'authorized') {
            register['$selected'] = false;
          }
        });*/
        this.poNotificationService.warning(
          this.literals['transmissionPendingTable']['warningMessage']
        );
        if (validEntires.length > 0) {
          this.isDisableButton = false;
        } else {
          this.isDisableButton = true;
        }
      }
    } else {
      this.isDisableButton = true;
    }
    this.emitButtonActivate(this.isDisableButton);
  }

  public emitButtonActivate(isButtonDisabled: boolean): void {
    this.buttonEmit.emit(isButtonDisabled);
  }

  public validSelectedEntryes(
    selectedEntries
  ): Array<
    | ItemTable
    | ItemTableSpecificEvent
    | ItemTableProcess
    | ItemTableMarketingByFarmer
    | ItemTableSocialSecurityContribution
    | ItemTableResourcesReceivedByTheSportsAssociation
    | ItemTableEventByTheSportsAssociation
  > {
    return selectedEntries;//.filter(item => item.status !== 'authorized');
  }

  public emitSelectedEntry(
    selectedEntry: Array<
      | ItemTable
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContribution
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTableEventByTheSportsAssociation
    >
  ): void {
    this.selectedEntry.emit(selectedEntry);
  }

  public showCheck(): boolean {

    let retEnableButton = false;
    if (this.EVENTS_REINF_DELETE.hasOwnProperty(this.event) && this.currentStatus === 'authorized') {
      retEnableButton = true;
    }

    if (this.EVENTS_REINF_RELAY.hasOwnProperty(this.event) && this.currentStatus === 'rejected') {
      retEnableButton = true;
    }
    return retEnableButton;

 }

}
