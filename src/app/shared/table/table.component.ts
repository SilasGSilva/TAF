import { Component,OnInit,ViewChild,Input,Output,EventEmitter,OnChanges } from '@angular/core';
import { PoTableColumn,PoTableLiterals,PoTableComponent,PoNotificationService } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { getBranchLoggedIn } from './../../../util/util';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { ReportFilterService } from 'shared/filter/report-filter/report-filter.service';
import { PayloadEventsReinf } from './../../models/payload-events-reinf';
import { ItemTable } from '../../taf-fiscal/models/item-table';
import { ItemTableProcess } from '../../taf-fiscal/models/item-table-process';
import { ItemTableSpecificEvent } from '../../taf-fiscal/models/item-table-specific-event';
import { ItemTableSocialSecurityContribution } from '../../taf-fiscal/models/item-table-social-security-contribution';
import { ItemTableMarketingByFarmer } from '../../taf-fiscal/models/item-table-marketing-by-farmer';
import { ItemTablePayamentCreditPhysicalBeneficiary } from './../../taf-fiscal/models/item-table-payments-credits-physical-beneficiary-validation';
import { ItemTablePayamentCreditLegalEntityBeneficiary } from './../../taf-fiscal/models/item-table-payments-credits-legal-entity-beneficiary-validation';
import { ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary } from './../../taf-fiscal/models/item-table-payments-or-credits-to-unidentified-beneficiary';
import { ItemTableRelatedEntity } from './../../taf-fiscal/models/item-table-related-entity';
import { ItemTableResourcesReceivedByTheSportsAssociation } from '../../taf-fiscal/reinf/dashboard/event-monitor/event-monitor-table/item-table-resources-received-by-the-sports-association';
import { TransmissionPendingService } from '../../taf-fiscal/reinf/dashboard/transmission/transmission-pending-table/transmission-pending.service';
import { ReportValidationTableService } from '../../taf-fiscal/reinf/reports/report-validation-table/report-validation-table.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
  public literals: object;
  public loadingShowMore:boolean = false;
  public companyId: string = '';
  public tafPage: number = 1;

  @Input('taf-event') event = '';
  @Input('taf-period') period = '';
  @Input('taf-path') path = '';
  @Input('taf-status') status = 'transmitted';
  @Input('taf-selectable') selectable = 'true';
  @Input('taf-enable-checkbox') enableCheckBox = true;
  @Input('taf-loading-overlay') loadingOverlay = false;
  @Input('taf-loading-table') loadingTable = false;
  @Input('taf-table-loading-overlay') tableLoadingOverlay = false;
  @Input('taf-show-details') showDetails = true;
  @Input('taf-custom-literals') customLiterals: PoTableLiterals;
  @Input('taf-table-items') tableItems: Array<
    | ItemTable
    | ItemTableSpecificEvent
    | ItemTableMarketingByFarmer
    | ItemTableResourcesReceivedByTheSportsAssociation
    | ItemTableSocialSecurityContribution
    | ItemTableProcess
    | ItemTablePayamentCreditPhysicalBeneficiary
    | ItemTablePayamentCreditLegalEntityBeneficiary
    | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
    | ItemTableRelatedEntity
  >;
  @Input('taf-table-items-all') tableItemsAll: Array<
  | ItemTable
  | ItemTableSpecificEvent
  | ItemTableMarketingByFarmer
  | ItemTableResourcesReceivedByTheSportsAssociation
  | ItemTableSocialSecurityContribution
  | ItemTableProcess
  | ItemTablePayamentCreditPhysicalBeneficiary
  | ItemTablePayamentCreditLegalEntityBeneficiary
  | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
  | ItemTableRelatedEntity
  >;
  @Input('taf-table-columns') tableColumns: Array<PoTableColumn> = [];
  @Input('taf-hasnext') hasNext:boolean = true;
  @Input('taf-size-add-more') addMoreItems:number = 20;

  @Output('taf-selected-entry') selectedEntry = new EventEmitter<
    Array<
      | ItemTable
      | ItemTableSpecificEvent
      | ItemTableMarketingByFarmer
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTableSocialSecurityContribution
      | ItemTableProcess
      | ItemTablePayamentCreditPhysicalBeneficiary
      | ItemTablePayamentCreditLegalEntityBeneficiary
      | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
      | ItemTableRelatedEntity
    >
  >();
  @Output('taf-error-message') errorMessage = new EventEmitter<string>();

  @ViewChild(PoTableComponent)
  tableComponent: PoTableComponent;

  constructor(
    private literalService: LiteralService,
    private reportValidationTableService: ReportValidationTableService,
    private transmissionPendingService: TransmissionPendingService,
    private reportFilterService: ReportFilterService,
    private masksPipe: MasksPipe,
    private poNotificationService: PoNotificationService
  )
  {
    this.literals = this.literalService.literalsShared;
    this.setShowDetails = this.setShowDetails.bind(this);
  }

  async ngOnInit(): Promise<void> {
    this.companyId = await getBranchLoggedIn();
    this.setShowDetails();
  }

  ngOnChanges() {
    if (this.path === 'event-monitor') {
      this.setShowDetails();
    }
  }

  public onSelectionChange(): void {
    this.emitSelectedEntry(this.tableComponent.getSelectedRows());
  }

  public setShowDetails() {
    return this.showDetails;
  }

  public showMore(): void {
    if(this.path === 'validation' && this.event.match(/R-2050|R-2055|R-2060|R-3010|R-1070/)) {
      this.addMoreBl20();
    } else {
      this.addMore();
    }
  }

  public addMoreBl20(): void {
    var lengthCurrent: number = this.tableItems.length;
    var tableItemsFilter: Array<any> = this.tableItemsAll.slice(lengthCurrent, lengthCurrent + this.addMoreItems);

    tableItemsFilter.forEach(element => {
      this.tableItems.push(element);
    });

    if(this.tableItems.length >= this.tableItemsAll.length) {
      this.hasNext = false;
    } else {
      this.hasNext = true;
    }
  }

  public async addMore(): Promise<void>{
    if(this.tableItems.length <= 20) {
      this.tafPage = 1;
    }

    const payload: PayloadEventsReinf = {
      period: this.period,
      event: this.event,
      companyId: this.companyId,
      page: ++ this.tafPage,
      pageSize: this.addMoreItems
    }

    if(this.path === 'validation') {
      this.setStatusLoading(true);
      this.reportValidationTableService.getInfoValidationPending(payload).subscribe(
        response => {
          this.loadMoreItems(response);
        },
        error => {
          this.poNotificationService.error(error);
        }
      );
    } else if(this.path === 'transmission' && this.event.match(/R-1050|R-4010|R-4020|R-4040|R-4080/)) {
      this.setStatusLoading(true);
      this.transmissionPendingService.getInfoTransmissionPending(payload).subscribe(
        response => {
          this.loadMoreItems(response);
        },
        error => {
          this.poNotificationService.error(error);
        }
      );
    } else if(this.path === 'eventsReport') {
      this.setStatusLoading(true);
      this.reportFilterService.getReportListing(payload).subscribe(
        response => {
          this.loadMoreItems(response);
        },
        error => {
          this.poNotificationService.error(error);
        }
      );
    } else {
      var lengthCurrent = this.tableItems.length;
      var tableItemsFilter = this.tableItemsAll.slice(lengthCurrent, lengthCurrent + this.addMoreItems);

      tableItemsFilter.forEach(element => {
        this.tableItems.push(element);
      });

      if(this.tableItems.length >= this.tableItemsAll.length) {
        this.hasNext = false;
      } else {
        this.hasNext = true;
      }
    }
  }

  public emitShowError(
    row: Array<
      | ItemTable
      | ItemTableSpecificEvent
      | ItemTableMarketingByFarmer
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTableSocialSecurityContribution
      | ItemTableProcess
      | ItemTablePayamentCreditPhysicalBeneficiary
      | ItemTablePayamentCreditLegalEntityBeneficiary
      | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
      | ItemTableRelatedEntity
    >
  ): void {
    this.errorMessage.emit(row['errorId']);
  }

  public emitSelectedEntry(
    selectedEntry: Array<
      | ItemTable
      | ItemTableSpecificEvent
      | ItemTableMarketingByFarmer
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTableSocialSecurityContribution
      | ItemTableProcess
      | ItemTablePayamentCreditPhysicalBeneficiary
      | ItemTablePayamentCreditLegalEntityBeneficiary
      | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
      | ItemTableRelatedEntity
    >
  ): void {
    this.selectedEntry.emit(selectedEntry);
  }

  public setTableItem(eventDetail: Array<any>): void {
    var item = [];
    item.length = 0;

    eventDetail.forEach(item =>{
      item.status = item.status ? item.status : 'notValidated';
      switch (this.event){
      case 'R-1000':
        item.contactTaxNumberFormated = this.masksPipe.transform(item.contactTaxNumber);
        item.taxNumberFormated = this.masksPipe.transform(item.taxNumber);
        break;
      case 'R-1050':
        item.cnpj = this.masksPipe.transform(item.cnpj);
        break;
      case 'R-2030':
        item.taxNumberFormated = this.masksPipe.transform(item.branchTaxNumber);
        break;
      case 'R-2040':
        item.taxNumberFormated = this.masksPipe.transform(item.branchTaxNumber);
        break;
      case 'R-3010':
        item.taxNumberPrincipal = this.masksPipe.transform(item.taxNumberPrincipal);
        item.taxNumberVisited = this.masksPipe.transform(item.taxNumberVisited);
        break;
      case 'R-4010':
        item.providerCPF = this.masksPipe.transform(item.providerCPF);
        item.cpf = this.masksPipe.transform(item.cpf);
        break;
      case 'R-4020':
          item.providerCNPJ = this.masksPipe.transform(item.providerCNPJ);
          item.cnpj = this.masksPipe.transform(item.cnpj);
          break;
      case 'R-4040':
          item.numInsc = this.masksPipe.transform(item.numInsc);
          break;
      case 'R-4080':
            item.numInsc = this.masksPipe.transform(item.numInsc);
            break;
      case 'R-5001':
        item.branchTaxNumber = this.masksPipe.transform(item.branchTaxNumber);
        break;
      case 'R-5011':
          item.branchTaxNumber = this.masksPipe.transform(item.branchTaxNumber);
          break;
      default:
        item.taxNumberFormated = this.masksPipe.transform(item.taxNumber);
        break;
      }
      this.tableItems.push(item);
    });
  }

  public setStatusLoading(status: boolean): void {
    this.loadingOverlay = status;
    this.loadingShowMore = status;
  }

  private loadMoreItems(response: {eventDetail: Array<any>, hasNext: boolean}): void {
    this.setTableItem(response.eventDetail);
    this.hasNext = response.hasNext;
    this.setStatusLoading(false);
  }
}
