import { Component,OnInit,Output,EventEmitter,ViewChild,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PoDisclaimer,PoNotificationService,PoTableColumn,PoTableComponent,PoTableLiterals } from '@po-ui/ng-components';
import { LiteralService } from 'literals';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { TransmissionPendingService } from './transmission-pending.service';
import { ItemTable } from '../../../../models/item-table';
import { ItemTableSpecificEvent } from '../../../../models/item-table-specific-event';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableRelatedEntity } from '../../../../models/item-table-related-entity';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableSocialSecurityContribution } from '../../../../models/item-table-social-security-contribution';
import { ItemTableEventByTheSportsAssociation } from '../../../../models/item-table-event-by-the-sports-association';
import { ItemTableResourcesReceivedByTheSportsAssociation } from '../../../../models/item-table-resources-received-by-the-sports-association';
import { ItemTablePaymentsOrCreditsToIndividualBeneficiary } from '../../../../models/item-table-payments-or-credits-to-individual-beneficiary';
import { ItemTablePaymentsOrCreditsToLegalEntityBeneficiary } from '../../../../models/item-table-payments-or-credits-to-legal-entity-beneficiary';
import { ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary } from '../../../../models/item-table-payments-or-credits-to-unidentified-beneficiary';
import { ItemTableReceiptRetention } from '../../../../models/item-table-receipt-retention';
import { PayloadEventsReinf } from '../../../../../models/payload-events-reinf';
import { getBranchLoggedIn } from '../../../../../../util/util';

@Component({
  selector: 'app-transmission-pending-table',
  templateUrl: './transmission-pending-table.component.html',
  styleUrls: ['./transmission-pending-table.component.scss'],
  providers: [MasksPipe],
})
export class TransmissionPendingTableComponent implements OnInit {
  public literals = {};
  public filter = '';
  public eventDetail: Array<
    | ItemTable
    | ItemTableSpecificEvent
    | ItemTableProcess
    | ItemTableRelatedEntity
    | ItemTableMarketingByFarmer
    | ItemTableSocialSecurityContribution
    | ItemTableResourcesReceivedByTheSportsAssociation
    | ItemTableEventByTheSportsAssociation
    | ItemTablePaymentsOrCreditsToIndividualBeneficiary
    | ItemTablePaymentsOrCreditsToLegalEntityBeneficiary
    | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
    | ItemTableReceiptRetention
  > = [];
  public eventDetailAll: Array<
  | ItemTable
  | ItemTableSpecificEvent
  | ItemTableProcess
  | ItemTableRelatedEntity
  | ItemTableMarketingByFarmer
  | ItemTableSocialSecurityContribution
  | ItemTableResourcesReceivedByTheSportsAssociation
  | ItemTableEventByTheSportsAssociation
  | ItemTablePaymentsOrCreditsToIndividualBeneficiary
  | ItemTablePaymentsOrCreditsToLegalEntityBeneficiary
  | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
  | ItemTableReceiptRetention
> = [];
  public tableColumns: Array<PoTableColumn> = [];
  public filters: Array<PoDisclaimer> = [];
  public showDetails: boolean;
  public customLiterals: PoTableLiterals;
  public previousFilter: Array<PoDisclaimer> = [];

  public filtered = this.activatedRoute.snapshot.queryParams.filtered;

  public tableLoad = true;
  public isDisablebutton = false;
  public searchLabel = '';
  public pageSize: number = 40;            //Quantidade de registros iniciais na página
  public addMoreItems: number = 20;        //Quantidade de itens que serão adicionados por clique no botão
  public hasNext: boolean = false;
  public itemChecked: boolean = false;
  @Input('taf-event') event = '';
  @Input('taf-eventSearch') eventSearch = '';
  @Input('taf-period') period = '';
  @Input('taf-path') path = '';
  @Output('taf-size-add-more') tafAddMoreEmit = new EventEmitter<number>();
  @Output('taf-hasnext') hasNextEmit = new EventEmitter<boolean>();
  @Output('taf-button-emit') buttonEmit = new EventEmitter<boolean>();
  @Output('taf-selected-entry') selectedEntry = new EventEmitter<
    Array<
      | ItemTable
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableRelatedEntity
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContribution
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTableEventByTheSportsAssociation
      | ItemTablePaymentsOrCreditsToIndividualBeneficiary
      | ItemTablePaymentsOrCreditsToLegalEntityBeneficiary
      | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
      | ItemTableReceiptRetention
    >
  >();

  @ViewChild(PoTableComponent)
  tableComponent: PoTableComponent;

  constructor(
    private transmissionPendingService: TransmissionPendingService,
    private masksPipe: MasksPipe,
    private literalsService: LiteralService,
    private poNotificationService: PoNotificationService,
    private activatedRoute: ActivatedRoute
  ) {
    this.literals = this.literalsService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.searchLabel = this.getSearchLabel(this.event);
    this.showDetails = this.getShowDetail(this.event);
    this.customLiterals = this.setCustomLiterals();
    this.tableColumns = this.transmission(this.event);
    this.getItems();
    //Altero a quantidade padrão do botão Carregar Mais Resultados
    this.tafAddMoreEmit.emit(this.addMoreItems);
    this.emitHasNext();
    if (this.event.match(/R-1050|R-2055|R-4010|R-4020|R-4040|R-4080/)) {
      this.emitButtonActivateR2055();
    }

    //IF necessário para filtrar os registros excluídos apenas do evento (card) de onde ocorreu o click.
    //Quando clicado no botão transmitir do card R-9000, o parâmetro eventSearch estará vazio, pois não deve ser aplicado o filtro.
    if (!this.filters.length && this.validEventSearch(this.eventSearch) ) {
      this.changeFilter(this.eventSearch)
    };
  }

  public getShowDetail(event: string): boolean {
    if (event.match(/R-1000|R-1050|R-4010|R-4020|R-4040|R-4080|R-9000/)) {
      return false;
    } else {
      return true;
    }
  }

  public getSearchLabel(event: string): string {
    switch (event) {
      case 'R-1000':
        return this.literals['transmissionPendingTable']['searchTypeTaxPayer'];
      case 'R-1050':
        return this.literals['transmissionPendingTable']['searchRelatedEntity'];
      case 'R-1070':
        return this.literals['transmissionPendingTable']['searchTypeProcess'];
      case 'R-2010':
        return this.literals['transmissionPendingTable']['searchType'];
      case 'R-2020':
        return this.literals['transmissionPendingTable']['searchType'];
      case 'R-2030':
        return this.literals['transmissionPendingTable']['searchTypeResourcesReceivedByTheSportsAssociation'];
      case 'R-2040':
        return this.literals['transmissionPendingTable']['searchTypeResourcesReceivedByTheSportsAssociation'];
      case 'R-2050':
        return this.literals['transmissionPendingTable']['searchTypeMarketingByFarmer'];
      case 'R-2055':
        return this.literals['transmissionPendingTable']['searchTypeMarketingByFarmer'];
      case 'R-2060':
        return this.literals['transmissionPendingTable']['searchSociaSecurityContribution'];
      case 'R-3010':
        return this.literals['transmissionPendingTable']['searchEventByTheSportsAssociation'];
      case 'R-4010':
        return this.literals['transmissionPendingTable']['searchBeneficiaryPhysicalPerson'];
      case 'R-4020':
        return this.literals['transmissionPendingTable']['searchBeneficiaryLegalPerson'];
      case 'R-4040':
        return this.literals['transmissionPendingTable']['searchNumInsc'];
      case 'R-4080':
        return this.literals['transmissionPendingTable']['searchNumInsc'];
      case 'R-9000':
        return this.literals['transmissionPendingTable']['searchDeletedEvents'];
      default:
        return '';
    }
  }

  public async getItems(): Promise<void> {
    const transmissionPending: PayloadEventsReinf = {
      companyId: await getBranchLoggedIn(),
      event: this.event,
      period: this.period,
    };

    if (this.event.match(/R-1050|R-4010|R-4020|R-4040|R-4080/)) {
      transmissionPending.page = 1;
      transmissionPending.pageSize = 20;
    }

    this.setTableLoad(true);
    this.eventDetail.length = 0;
    this.transmissionPendingService
      .getInfoTransmissionPending(transmissionPending)
      .subscribe(
        response => {
          if (response.eventDetail.length) {
            this.setTableItems(
              this.handleTransmissionPendingItems(
                response.eventDetail.sort((a, b) =>
                  a.status > b.status ? 1 : -1
                )
              )
            );

            if (this.event.match(/R-1050|R-4010|R-4020|R-4040|R-4080/)) {
              this.hasNext = response.hasNext;
            }

            this.setTableLoad(false);
            this.reloadFilter();
          } else {
            this.setTableLoad(false);
          }
        },
        error => {
          this.setTableLoad(false);
          this.poNotificationService.error(error);
        }
      );
  }

  public handleTransmissionPendingItems(
    items
  ): Array<
    | ItemTable
    | ItemTableSpecificEvent
    | ItemTableProcess
    | ItemTableRelatedEntity
    | ItemTableMarketingByFarmer
    | ItemTableSocialSecurityContribution
    | ItemTableResourcesReceivedByTheSportsAssociation
    | ItemTableEventByTheSportsAssociation
    | ItemTablePaymentsOrCreditsToIndividualBeneficiary
    | ItemTablePaymentsOrCreditsToLegalEntityBeneficiary
    | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
    | ItemTableReceiptRetention
  > {
    const itemsTable = [];

    items.forEach(item => {
      if (this.event === 'R-1000') {
        item.contactTaxNumberFormated = this.masksPipe.transform(
          item.contactTaxNumber ? item.contactTaxNumber : ''
        );
        item.taxNumberFormated = this.masksPipe.transform(
          item.taxNumber ? item.taxNumber : ''
        );
      } else if (this.event === 'R-1050') {
        item.cnpj = this.masksPipe.transform(item.cnpj);
      } else if (this.event === 'R-3010') {
        item.taxNumberPrincipal = this.masksPipe.transform(
          item.taxNumberPrincipal
        );
        item.taxNumberVisited = this.masksPipe.transform(item.taxNumberVisited);
      } else if (this.event === 'R-2055') {
        item.acquiringCNPJ = this.masksPipe.transform(item.acquiringCNPJ);
        item.taxNumberFormated = this.masksPipe.transform(item.taxNumber ? item.taxNumber : '');
      } else if (this.event === 'R-4010') {
        item.cpf = this.masksPipe.transform(item.cpf);
      } else if (this.event === 'R-4020') {
        item.cnpj = this.masksPipe.transform(item.cnpj);
      } else if (this.event === 'R-4040') {
        item.numInsc = this.masksPipe.transform(item.numInsc);
      } else if (this.event === 'R-4080') {
        item.numInsc = this.masksPipe.transform(item.numInsc);
      } else {
        item.taxNumberFormated =
          this.event === 'R-2060'
            ? this.masksPipe.transform(item.companyTaxNumber)
            : this.masksPipe.transform(item.taxNumber ? item.taxNumber : '');
      }
      itemsTable.push(item);
    });

    return itemsTable;
  }

  public setTableItems(items): void {
    if (this.filtered === 'true'){
      this.eventDetailAll = items.filter(item => item.status !== 'transmitted');
    }else{
      this.eventDetailAll = items;
    }

    if (this.eventDetailAll != null && this.eventDetailAll != undefined){
      if (this.eventDetailAll.length > 0){
        this.eventDetail = this.eventDetailAll.slice(0,this.pageSize);
      }else{
        this.eventDetail = [];
      }
    }

    if (this.event.match(/R-1050|R-2055|R-4010|R-4020|R-4040|R-4080/)) {
      this.itemChecked = false;
      this.emitButtonActivateR2055();
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

  public changeFilter(value: string): void {
    value ? this.addFilter(value) : this.resetFilters();
  }

  public addFilter(value: string): void {
    this.executeFilter(value);

    this.filters = [
      ...this.filters,
      { property: '', value: value, label: `${value}` },
    ];
    this.filter = '';
  }

  public reloadFilter(): void {
    if (this.filters.length) {
      this.filters.forEach(filter => this.executeFilter(filter.value));
    }
  }

  public executeFilter(value: string): void {
    this.eventDetail = this.eventDetail.filter((property: any) => {
      if (this.event.match(/R-2010|R-2020/)) {
        return (
          property.branchTaxNumber
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.taxNumber
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.taxNumberFormated
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.company
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.branch
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      } else if (this.event === 'R-1000') {
        return (
          property.typeOfInscription
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.taxNumber
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.taxNumberFormated
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      } else if (this.event === 'R-1050') {
        return (
          property.cnpj
            .replace(/\.|\-/g,'')
            .includes(value.replace(/\.|\-/g,'')) ||
          property.tpEntLig
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
          );
      } else if (this.event === 'R-1070') {
        return (
          property.proccesNumber
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.proccesType
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.beginingDate
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      } else if (this.event.match(/R-2030|R-2040/)) {
        return (
          property.taxNumber
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.taxNumberFormated
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      } else if (this.event === 'R-2050') {
        return (
          property.company
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.taxNumber
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.taxNumberFormated
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      } else if (this.event === 'R-2055') {
        return (
          property.company
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.taxNumber
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.taxNumberFormated
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      } else if (this.event === 'R-9000') {
        return (
          property.branchId
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.event
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.receipt
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      } else if (this.event === 'R-2060') {
        return (
          property.typeOfInscription
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.companyTaxNumber
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.taxNumberFormated
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      } else if (this.event === 'R-3010') {
        return (
          property.branch
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          property.newsletterNumber
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      } else if (this.event === 'R-4010') {
        return (
          property.cpf
            .replace(/\.|\-/g,'')
            .includes(value.replace(/\.|\-/g,'')) ||
          property.name
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      } else if (this.event === 'R-4020') {
        return (
          property.cnpj
            .replace(/\.|\-/g,'')
            .includes(value.replace(/\.|\-/g,'')) ||
          property.beneficiaryName
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      } else if (this.event.match(/R-4040|R-4080/)) {
        return (
          property.numInsc
            .replace(/\.|\-/g,'')
            .includes(value.replace(/\.|\-/g,''))
        );
      }
    });
  }

  public changeFilters(filters: Array<PoDisclaimer>): void {
    if (!filters.length) {
      this.resetFilters();
    } else if (filters.length < this.previousFilter.length) {
      this.previousFilter = [...this.filters];
      this.resetFilters();
    } else {
      this.previousFilter = [...this.filters];
    }
  }

  public resetFilters(): void {
    this.getItems();
  }

  public onSelectionChange(
    selectedEntry: Array<
      | ItemTable
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableRelatedEntity
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContribution
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTableEventByTheSportsAssociation
      | ItemTablePaymentsOrCreditsToIndividualBeneficiary
      | ItemTablePaymentsOrCreditsToLegalEntityBeneficiary
      | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
      | ItemTableReceiptRetention
    >
  ): void {
    this.itemChecked = false;
    if (selectedEntry.length) {
      const validEntires = this.validSelectedEntryes(selectedEntry);
      if (validEntires.length === selectedEntry.length) {
        this.isDisablebutton = false;
        this.emitSelectedEntry(validEntires);
        this.itemChecked = true;
      } else {
        selectedEntry.forEach(register => {
          if (register.status === 'transmitted') {
            register['$selected'] = false;
          }
        });
        this.poNotificationService.warning(
          this.literals['transmissionPendingTable']['warningMessage']
        );
        if (validEntires.length > 0) {
          this.isDisablebutton = false;
          this.emitSelectedEntry(validEntires);
          this.itemChecked = true;
        } else {
          this.isDisablebutton = true;
        }
      }
    } else {
      const validEntires: Array<any> = [];
      this.emitSelectedEntry( validEntires );
      this.isDisablebutton = true;
    }
    this.emitButtonActivate(this.isDisablebutton);
  }

  public setShowDetails(): boolean {
    return this.showDetails;
  }

  public emitButtonActivate(isButtonDisabled: boolean): void {
    this.buttonEmit.emit(isButtonDisabled);
  }

  public emitButtonActivateR2055(): void {
    this.buttonEmit.emit();
  }

  public validSelectedEntryes(
    selectedEntries
  ): Array<
    | ItemTable
    | ItemTableSpecificEvent
    | ItemTableProcess
    | ItemTableRelatedEntity
    | ItemTableMarketingByFarmer
    | ItemTableSocialSecurityContribution
    | ItemTableResourcesReceivedByTheSportsAssociation
    | ItemTableEventByTheSportsAssociation
    | ItemTablePaymentsOrCreditsToIndividualBeneficiary
    | ItemTablePaymentsOrCreditsToLegalEntityBeneficiary
    | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
    | ItemTableReceiptRetention
  > {
    return selectedEntries.filter(item => item.status !== 'transmitted');
  }

  public emitSelectedEntry(
    selectedEntry: Array<
      | ItemTable
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableRelatedEntity
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContribution
      | ItemTableResourcesReceivedByTheSportsAssociation
      | ItemTableEventByTheSportsAssociation
      | ItemTablePaymentsOrCreditsToIndividualBeneficiary
      | ItemTablePaymentsOrCreditsToLegalEntityBeneficiary
      | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
      | ItemTableReceiptRetention
    >
  ): void {
    this.selectedEntry.emit(selectedEntry);
  }

  public reloadData(): void {
    this.loadData();
  }

  public setTableLoad(status: boolean): void {
    this.tableLoad = status;
  }

  public transmission(event: string): Array<PoTableColumn> {
    const eventFunctionName = event.replace(/-/g, '_');

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
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'branch',
        label: this.literals['transmissionTable']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'typeOfInscription',
        label: this.literals['transmissionTable']['typeOfInscription'],
        width: '9%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['transmissionTable']['taxNumber'],
        width: '8%',
      },
      {
        property: 'beginingDate',
        label: this.literals['transmissionTable']['beginingDate'],
        width: '8%',
      },
      {
        property: 'finishingdate',
        label: this.literals['transmissionTable']['finishingdate'],
        width: '8%',
      },
      {
        property: 'taxClassification',
        label: this.literals['transmissionTable']['taxClassification'],
        width: '12%',
      },
      {
        property: 'isMandatoryBookkeeping',
        label: this.literals['transmissionTable']['isMandatoryBookkeeping'],
        width: '12%',
      },
      {
        property: 'isPayrollExemption',
        label: this.literals['transmissionTable']['isPayrollExemption'],
        width: '13%',
      },
      {
        property: 'hasFineExemptionAgreement',
        label: this.literals['transmissionTable']['hasFineExemptionAgreement'],
        width: '12%',
      },
      {
        property: 'contact',
        label: this.literals['transmissionTable']['contact'],
        width: '12%',
      },
      {
        property: 'contactTaxNumberFormated',
        label: this.literals['transmissionTable']['contactTaxNumber'],
        width: '8%',
      },
    ];
  }

  public R_1050(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'branchId',
        label: this.literals['transmissionTable']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'cnpj',
        label: this.literals['transmissionTable']['relatedEntityCnpj'],
        type: 'string',
        width: '25%',
      },
      {
        property: 'tpEntLig',
        label: this.literals['transmissionTable']['relatedEntityClassification'],
        type: 'string',
        width: '50%',
      }
    ];
  }

  public R_1070(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'proccesType',
        label: this.literals['transmissionTable']['proccesType'],
        type: 'string',
      },
      {
        property: 'proccesNumber',
        label: this.literals['transmissionTable']['proccesNumber'],
        type: 'string',
      },
      {
        property: 'courtFederatedUnit',
        label: this.literals['transmissionTable']['courtFederatedUnit'],
        type: 'string',
      },
      {
        property: 'cityCode',
        label: this.literals['transmissionTable']['cityCode'],
        type: 'string',
      },
      {
        property: 'courtId',
        label: this.literals['transmissionTable']['courtId'],
        type: 'string',
      },
      {
        property: 'beginingDate',
        label: this.literals['transmissionTable']['beginingOfValidity'],
        type: 'string',
      },
      {
        property: 'finishingDate',
        label: this.literals['transmissionTable']['finishingOfValidity'],
        type: 'string',
      },
    ];
  }

  public R_2010(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'branch',
        label: this.literals['transmissionTable']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['transmissionTable']['companyTaxNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'company',
        label: this.literals['transmissionTable']['company'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'totalInvoice',
        label: this.literals['transmissionTable']['totalInvoice'],
        width: '10%',
        type: 'number',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['transmissionTable']['totalGrossValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxBase',
        label: this.literals['transmissionTable']['totalTaxBase'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxes',
        label: this.literals['transmissionTable']['totalTaxes'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2020(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'branch',
        label: this.literals['transmissionTable']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['transmissionTable']['companyTaxNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'company',
        label: this.literals['transmissionTable']['company'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'totalInvoice',
        label: this.literals['transmissionTable']['totalInvoice'],
        width: '10%',
        type: 'number',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['transmissionTable']['totalGrossValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxBase',
        label: this.literals['transmissionTable']['totalTaxBase'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxes',
        label: this.literals['transmissionTable']['totalTaxes'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2030(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '20%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['transmissionTable']['branchTaxNumber'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['transmissionTable']['totalGrossValue'],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalReceivedWithholdAmount',
        label: this.literals['transmissionTable'][
          'totalReceivedWithHoldAmount'
        ],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalValueOfRetentionWithSuspendedLiability',
        label: this.literals['transmissionTable'][
          'totalValueOfRetentionWithSuspendedLiability'
        ],
        width: '20%',
        type: 'number',
        format: '1.2-5',
        visible: false,
      },
    ];
  }

  public R_2040(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '20%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['transmissionTable']['branchTaxNumber'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['transmissionTable']['totalGrossValue'],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalReceivedWithholdAmount',
        label: this.literals['transmissionTable'][
          'totalReceivedWithHoldAmount'
        ],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalValueOfRetentionWithSuspendedLiability',
        label: this.literals['transmissionTable'][
          'totalValueOfRetentionWithSuspendedLiability'
        ],
        width: '20%',
        type: 'number',
        format: '1.2-5',
        visible: false,
      },
    ];
  }

  public R_2050(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['transmissionTable']['registrationNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'company',
        label: this.literals['transmissionTable']['company'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['transmissionTable']['totalGrossValue'],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValue',
        label: this.literals['transmissionTable'][
          'sociaSecurityContributionValue'
        ],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValueGilrat',
        label: this.literals['transmissionTable'][
          'sociaSecurityContributionValueGilrat'
        ],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValueSenar',
        label: this.literals['transmissionTable'][
          'sociaSecurityContributionValueSenar'
        ],
        width: '10%',
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2055(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        width: '8%',
      },
      {
        property: 'acquiringBranch',
        label: this.literals['table']['acquiringBranch'],
        type: 'string',
        width: '8%',
      },
      {
        property: 'acquiringCNPJ',
        label: this.literals['table']['acquiringCNPJ'],
        type: 'string',
      },
      {
        property: 'typeOfInscription',
        label: this.literals['table']['typeOfInscription'],
        type: 'string',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['table']['registrationNumber'],
        type: 'string',
      },
      {
        property: 'company',
        label: this.literals['table']['company'],
        type: 'string',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['table']['totalGrossValue'],
        type: 'number',
        format: '1.2-5',
      },

      {
        property: 'valueGilRat',
        label: this.literals['table']['valueGilRat'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'valueSenar',
        label: this.literals['table']['valueSenar'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'valueINSS',
        label: this.literals['table']['valueINSS'],
        type: 'number',
        format: '1.2-5',
      },

    ];
  }

  public R_2060(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'typeOfInscription',
        label: this.literals['transmissionTable']['typeOfInscription'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'taxNumberFormated',
        label: this.literals['transmissionTable']['companyTaxNumber'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'totalInvoice',
        label: this.literals['transmissionTable']['totalInvoice'],
        width: '10%',
        type: 'number',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['transmissionTable']['totalGrossValue'],
        width: '15%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValue',
        label: this.literals['transmissionTable'][
          'sociaSecurityContributionValue'
        ],
        width: '20%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'sociaSecurityContributionValueSuspended',
        label: this.literals['transmissionTable'][
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
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'branch',
        label: this.literals['transmissionTable']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'newsletterNumber',
        label: this.literals['transmissionTable']['newsletterNumber'],
        type: 'number',
        width: '10%',
      },
      {
        property: 'mode',
        label: this.literals['transmissionTable']['mode'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'competition',
        label: this.literals['transmissionTable']['competition'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'taxNumberPrincipal',
        label: this.literals['transmissionTable']['taxNumberPrincipal'],
        width: '20%',
        visible: false,
      },
      {
        property: 'taxNumberVisited',
        label: this.literals['transmissionTable']['taxNumberVisited'],
        type: 'string',
        width: '20%',
        visible: false,
      },
      {
        property: 'payingOffValue',
        label: this.literals['transmissionTable']['payingOffValue'],
        type: 'number',
        width: '10%',
      },
      {
        property: 'dontPayingOffValue',
        label: this.literals['transmissionTable']['dontPayingOffValue'],
        type: 'number',
        width: '10%',
      },
      {
        property: 'grossValue',
        label: this.literals['transmissionTable']['grossValue'],
        type: 'number',
        format: '1.2-5',
        width: '10%',
      },
      {
        property: 'contributionValue',
        label: this.literals['transmissionTable']['contributionValue'],
        type: 'number',
        format: '1.2-5',
        width: '10%',
      },
      {
        property: 'contributionValueSuspended',
        label: this.literals['transmissionTable']['contributionValueSuspended'],
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
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'branchId',
        label: this.literals['transmissionTable']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'cpf',
        label: this.literals['transmissionTable']['beneficiaryCpf'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'name',
        label: this.literals['transmissionTable']['beneficiaryName'],
        type: 'string',
        width: '25%',
      },
      {
        property: 'grossValue',
        label: this.literals['transmissionTable']['totalGrossValue'],
        type: 'number',
        width: '15%',
        format: '1.2-5',
      },
      {
        property: 'irValue',
        label: this.literals['transmissionTable']['totalIrValue'],
        type: 'number',
        width: '15%',
        format: '1.2-5',
      }
    ];
  }

  public R_4020(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'branchId',
        label: this.literals['transmissionTable']['branch'],
        type: 'string',
        width: '8%',
      },
      {
        property: 'cnpj',
        label: this.literals['transmissionTable']['beneficiaryCnpj'],
        type: 'string',
        width: '14%',
      },
      {
        property: 'beneficiaryName',
        label: this.literals['transmissionTable']['beneficiaryName'],
        type: 'string',
        width: '14%',
      },
      {
        property: 'totalValue',
        label: this.literals['transmissionTable']['totalGrossValue'],
        type: 'number',
        width: '9%',
        format: '1.2-5',
      },
      {
        property: 'irBaseValue',
        label: this.literals['transmissionTable']['totalTaxBase'],
        type: 'number',
        width: '9%',
        format: '1.2-5',
      },
      {
        property: 'irValue',
        label: this.literals['transmissionTable']['totalIrValue'],
        type: 'number',
        width: '9%',
        format: '1.2-5',
      },
      {
        property: 'csllValue',
        label: this.literals['transmissionTable']['totalCsllValue'],
        type: 'number',
        width: '9%',
        format: '1.2-5',
      },
      {
        property: 'cofinValue',
        label: this.literals['transmissionTable']['totalCofinsValue'],
        type: 'number',
        width: '9%',
        format: '1.2-5',
      },
      {
        property: 'ppValue',
        label: this.literals['transmissionTable']['totalPisValue'],
        type: 'number',
        width: '9%',
        format: '1.2-5',
      },
      {
        property: 'agregValue',
        label: this.literals['transmissionTable']['totalAgregValue'],
        type: 'number',
        width: '9%',
        format: '1.2-5',
      }
    ];
  }

  public R_4040(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'branchId',
        label: this.literals['transmissionTable']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'numInsc',
        label: this.literals['transmissionTable']['registrationNumber'],
        type: 'string',
        width: '30%',
      },
      {
        property: 'liquidValue',
        label: this.literals['transmissionTable']['totalLiquidValue'],
        type: 'number',
        width: '15%',
        format: '1.2-5',
      },
      {
        property: 'irBaseValue',
        label: this.literals['transmissionTable']['totalTaxBase'],
        type: 'number',
        width: '15%',
        format: '1.2-5',
      },
      {
        property: 'irValue',
        label: this.literals['transmissionTable']['totalIrValue'],
        type: 'number',
        width: '15%',
        format: '1.2-5',
      }
    ];
  }

  public R_4080(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['transmissionTable']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'branchId',
        label: this.literals['transmissionTable']['branch'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'numInsc',
        label: this.literals['transmissionTable']['registrationNumber'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'fontName',
        label: 'Nome',
        type: 'string',
        width: '30%',
      },
      {
        property: 'liquidValue',
        label: this.literals['transmissionTable']['totalGrossValue'],
        type: 'number',
        width: '10%',
        format: '1.2-5',
      },
      {
        property: 'irBaseValue',
        label: this.literals['transmissionTable']['totalTaxBase'],
        type: 'number',
        width: '10%',
        format: '1.2-5',
      },
      {
        property: 'irValue',
        label: this.literals['transmissionTable']['totalIrValue'],
        type: 'number',
        width: '10%',
        format: '1.2-5',
      }
    ];
  }

  public R_9000(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        type: 'label',
        width: '10%',
        labels: [
          {
            value: 'transmitted',
            color: 'success',
            label: this.literals['transmissionTable']['transmitted'],
          },
          {
            value: 'notTransmitted',
            color: 'primary',
            label: this.literals['transmissionTable']['pendingTransmission'],
          },
        ],
      },
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        width: '30%',
      },
      {
        property: 'event',
        label: this.literals['table']['event'],
        type: 'string',
        width: '30%',
      },
      {
        property: 'receipt',
        label: this.literals['table']['receipt'],
        type: 'string',
        width: '30%',
      },
    ];
  }

  public setCustomLiterals(): PoTableLiterals {
    return this.literals['transmissionPendingTable']['dataNotFound'];
  }

  public validEventSearch(eventSearch): boolean{
    if (eventSearch === null || eventSearch == undefined){
      return false;
    }else {
      return (eventSearch.trim().length > 0);
    }
  }
}
