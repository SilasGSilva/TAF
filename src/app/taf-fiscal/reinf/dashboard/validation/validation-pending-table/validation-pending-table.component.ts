import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  Input,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  PoTableColumn,
  PoNotificationService,
  PoTableLiterals,
  PoModalComponent,
  PoModalAction,
  PoToolbarAction,
} from '@po-ui/ng-components';

import { TableComponent } from 'shared/table/table.component';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { ValidationPendingService } from './validation-pending-table.service';
import { ItemTableSpecificEvent } from '../../../../models/item-table-specific-event';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableSocialSecurityContributionValidation } from '../../../../models/item-table-social-security-contribution-validation';
import { ItemTableResourcesReceivedByTheSportsAssociationValidation } from '../../../../models/item-table-resources-received-by-the-sports-association-validation';
import { ItemTableEventByTheSportsAssociation } from '../../../../models/item-table-event-by-the-sports-association';
import { ItemTablePayamentCreditPhysicalBeneficiary } from './../../../../models/item-table-payments-credits-physical-beneficiary-validation';
import { ItemTablePayamentCreditLegalEntityBeneficiary } from './../../../../models/item-table-payments-credits-legal-entity-beneficiary-validation';
import { ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary } from '../../../../models/item-table-payments-or-credits-to-unidentified-beneficiary';
import { ItemTableReceiptRetention } from './../../../../models/item-table-receipt-retention';
import { ItemTableRelatedEntity } from './../../../../models/item-table-related-entity';
import { ItemTableValidation } from '../../../../models/item-table-validation';
import { PayloadEventsReinf } from '../../../../../models/payload-events-reinf';
import { PayloadValidationErrors } from '../../../../models/payload-validation-errors';
import { getBranchLoggedIn } from '../../../../../../util/util';
import { LiteralService } from 'literals';

@Component({
  selector: 'app-validation-pending-table',
  templateUrl: './validation-pending-table.component.html',
  styleUrls: ['./validation-pending-table.component.scss'],
})
export class ValidationPendingTableComponent implements OnInit {
  public literals: object;
  public searchKey: object;
  public validationErrors = [];
  public tableColumns: Array<PoTableColumn> = [];
  public tableItems: Array<
    | ItemTableValidation
    | ItemTableSpecificEvent
    | ItemTableProcess
    | ItemTableMarketingByFarmer
    | ItemTableSocialSecurityContributionValidation
    | ItemTableResourcesReceivedByTheSportsAssociationValidation
    | ItemTableEventByTheSportsAssociation
    | ItemTablePayamentCreditPhysicalBeneficiary
    | ItemTablePayamentCreditLegalEntityBeneficiary
    | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
    | ItemTableReceiptRetention
    | ItemTableRelatedEntity
  > = [];
  public tableItemsAll: Array<
  | ItemTableValidation
  | ItemTableSpecificEvent
  | ItemTableProcess
  | ItemTableMarketingByFarmer
  | ItemTableSocialSecurityContributionValidation
  | ItemTableResourcesReceivedByTheSportsAssociationValidation
  | ItemTableEventByTheSportsAssociation
  | ItemTablePayamentCreditPhysicalBeneficiary
  | ItemTablePayamentCreditLegalEntityBeneficiary
  | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
  | ItemTableReceiptRetention
  | ItemTableRelatedEntity
> = [];
  public isDisablebutton = true;
  public loadingOverlay = false;
  public messageError: boolean;
  public customLiterals: PoTableLiterals;
  public statusMessage: string = '';
  public rowsTextArea: number;
  public startTime: Date;
  public endTime: Date;
  public handleClosed: PoModalAction = {
    action: () => {
      this.handleModalClosed(this.messageError);
    },
    label: 'Ok',
    danger: false,
  };

  public page: number = 1;
  public pageSize: number = 20;      //Quantidade de registros iniciais na página
  public addMoreItems: number = 20;  //Quantidade de itens que serão adioionados por clique no botão
  public hasNext: boolean = false;
  public validationAll: boolean = ('R-2010|R-2020|R-4010|R-4020|R-4040|R-4080|R-1050').indexOf( this.activatedRoute.snapshot.queryParams.event ) >= 0; ////Eventos que tem a opcao "Apurar tudo"

  @Input('taf-period') period = '';
  @Input('taf-event') event = '';
  @Input('taf-path') path = '';
  @Output('taf-size-add-more') tafAddMoreEmit = new EventEmitter<number>();
  @Output('taf-button-emit') buttonEmit = new EventEmitter<boolean>();
  @Output('taf-selected-entry') selectedEntry = new EventEmitter<
    Array<
      | ItemTableValidation
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContributionValidation
      | ItemTableResourcesReceivedByTheSportsAssociationValidation
      | ItemTableEventByTheSportsAssociation
      | ItemTablePayamentCreditPhysicalBeneficiary
      | ItemTablePayamentCreditLegalEntityBeneficiary
    >
  >();
  @Output('taf-button-emit-label') buttonLabelEmit = new EventEmitter<boolean>();

  @ViewChild(PoModalComponent) poModal: PoModalComponent;
  @ViewChild(TableComponent, { static: true }) appTable: TableComponent;

  constructor(
    private masksPipe: MasksPipe,
    private validationPendingService: ValidationPendingService,
    private literalService: LiteralService,
    private poNotificationService: PoNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.handleLoadOverlay(true);
    this.customLiterals = this.setCustomLiterals();
    this.tableColumns = this.validation(this.event);
    this.getInfoTableValidationPending();
    //Altero a quantidade padrão do botão Carregar Mais Resultados
    this.tafAddMoreEmit.emit(this.addMoreItems);
    this.emitHasNext();
  }

  public async getInfoTableValidationPending(): Promise<void> {
    const payload: PayloadEventsReinf = {
      period: this.period,
      event: this.event,
      companyId: await getBranchLoggedIn(),
      page: this.page,
      pageSize: this.pageSize,
      routine: 'validation',
    };

    const errors = await JSON.parse(sessionStorage.getItem('TAFLogValidation'));

    const body = { registryKey: errors ? errors : '' };

    this.tableItems.length = 0;

    this.validationPendingService
      .getInfoValidationPending(payload, body)
      .subscribe(
        response => {
          if (!response.eventDetail[0].hasOwnProperty('existProcId')) {
            this.setTableItem(this.handleValidationPendingItems(response.eventDetail), response.hasNext);
            this.handleLoadOverlay(false);
          } else {
            this.handleMessageError(false);
            response.eventDetail.map(item =>
              this.showMessage(item['existProcId'])
            );
          }
        },
        error => {
          this.poNotificationService.error(error);
          this.handleLoadOverlay(false);
        }
      );
  }

  public showMessage(message: string): void {
    this.statusMessage = message;
    this.poModal.open();
  }

  public handleModalClosed(status: boolean): void {
    this.poModal.close();
    if (!status) {
      this.router.navigate(['/eventsMonitor']);
    }
  }

  public handleValidationPendingItems(
    eventDetail: Array<
      | ItemTableValidation
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableResourcesReceivedByTheSportsAssociationValidation
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContributionValidation
      | ItemTableEventByTheSportsAssociation
      | ItemTablePayamentCreditPhysicalBeneficiary
      | ItemTablePayamentCreditLegalEntityBeneficiary
    >
  ): Array<
    | ItemTableValidation
    | ItemTableSpecificEvent
    | ItemTableProcess
    | ItemTableResourcesReceivedByTheSportsAssociationValidation
    | ItemTableMarketingByFarmer
    | ItemTableSocialSecurityContributionValidation
    | ItemTableEventByTheSportsAssociation
    | ItemTablePayamentCreditPhysicalBeneficiary
    | ItemTablePayamentCreditLegalEntityBeneficiary
  > {
    const tableItems = [];

    eventDetail.forEach(item => {
      item.status = item.status ? item.status : 'notValidated';
      if (this.event === 'R-1000') {
        item['contactTaxNumberFormated'] = this.masksPipe.transform(
          item['contactTaxNumber']
        );
        item['taxNumberFormated'] = this.masksPipe.transform(item['taxNumber']);
      } else if (this.event === 'R-3010') {
        item['taxNumberPrincipal'] = this.masksPipe.transform(
          item['taxNumberPrincipal']
        );
        item['taxNumberVisited'] = this.masksPipe.transform(
          item['taxNumberVisited']
        );
      } else if (this.event === 'R-2055') {
        item['inscriptionAcq'] = this.masksPipe.transform(
          item['inscriptionAcq']
        );
      } else if (this.event === 'R-4010') {
        item['providerCPF'] = this.masksPipe.transform(
          item['providerCPF']
        );
      } else if (this.event === 'R-4020') {
        item['providerCNPJ'] = this.masksPipe.transform(
          item['providerCNPJ']
        );
      } else if (this.event.match('R-4040|R-4080') ) {
        item['numInsc'] = this.masksPipe.transform(
          item['numInsc']
        );
      } else if (this.event.match('R-1050') ) {
        item['cnpj'] = this.masksPipe.transform(
          item['cnpj']
        );
      } else {
        item['taxNumberFormated'] = this.event.match(/R-2030|R-2040/)
          ? this.masksPipe.transform(item['branchTaxNumber'])
          : this.masksPipe.transform(item['taxNumber']);
      }

      tableItems.push(item);
    });
    return tableItems;
  }

  public setTableItem(
    items: Array<
      | ItemTableValidation
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableResourcesReceivedByTheSportsAssociationValidation
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContributionValidation
      | ItemTableEventByTheSportsAssociation
      | ItemTablePayamentCreditPhysicalBeneficiary
      | ItemTablePayamentCreditLegalEntityBeneficiary
    >,hasNextParam: boolean
  ) {
    this.tableItemsAll = items;
    if (this.tableItemsAll != null && this.tableItemsAll != undefined){
      if (this.tableItemsAll.length > 0){
        this.tableItems = this.tableItemsAll.slice(0,this.pageSize);
      }else{
        this.tableItems = [];
      }
    }
    this.hasNext = hasNextParam;
    this.emitHasNext();
  }

  public emitHasNext(): void {
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
    }

    this.appTable.hasNext = this.hasNext;
  }

  public onSelectionChange(
    selectedEntry: Array<
      | ItemTableValidation
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContributionValidation
      | ItemTableResourcesReceivedByTheSportsAssociationValidation
      | ItemTableEventByTheSportsAssociation
      | ItemTablePayamentCreditPhysicalBeneficiary
      | ItemTablePayamentCreditLegalEntityBeneficiary
    >
  ): void {
    if (selectedEntry.length) {
      if (this.path !== 'eventsReport') {
        const validEntires = this.validSelectedEntries(selectedEntry);
        var markedItems: number = 0;
        if (validEntires.length === selectedEntry.length) {
          markedItems++;
          this.handleButtonActivate(false);
          this.emitSelectedEntry(validEntires);
        } else {
          selectedEntry.forEach(register => {
            if (register.status === 'validated') {
              register['$selected'] = false;
            };
          });
          this.showPoNotification();
          if (validEntires.length > 0) {
            this.handleButtonActivate(false);
            this.emitSelectedEntry(validEntires);
            markedItems++;
          } else {
            this.handleButtonActivate(true);
          };
        };
      } else {
        this.handleButtonActivate(true);
      };
    } else {
      var markedItems: number = 0;
      const validEntires: Array<any> = [];
      this.emitSelectedEntry( validEntires );
      if(this.validationAll) {
        this.handleButtonActivate(false);
      } else {
        this.handleButtonActivate(true);
      };
    };

    if (!this.validationAll) {
      this.emitButtonActivate(this.isDisablebutton);
    } else {
      this.emitButtonChangeLabel(markedItems > 0);
    };
  }

  public showPoNotification(): void {
    if (!this.startTime) {
      this.poNotificationService.warning(
        this.literals['table']['warningMessage']
      );
      this.startTime = new Date();
    } else {
      this.endTime = new Date();
      if (this.endTime.getTime() - this.startTime.getTime() >= 11000) {
        this.startTime = this.endTime;
        this.poNotificationService.warning(
          this.literals['table']['warningMessage']
        );
      }
    }
  }

  public showDetails(): boolean {
    return this.event.match('R-1000|R-2055|R-4040|R-1050') ? false : true;
  }

  public setCustomLiterals(): PoTableLiterals {
    return this.literals['table']['dataNotFound'];
  }

  public reload(): void {
    this.loadData();
  }

  public emitButtonActivate(isButtonDisabled: boolean): void {
    this.buttonEmit.emit(isButtonDisabled);
  }

  public emitSelectedEntry(
    selectedEntry: Array<
      | ItemTableValidation
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContributionValidation
      | ItemTableResourcesReceivedByTheSportsAssociationValidation
      | ItemTableEventByTheSportsAssociation
      | ItemTablePayamentCreditPhysicalBeneficiary
      | ItemTablePayamentCreditLegalEntityBeneficiary
    >
  ): void {
    this.selectedEntry.emit(selectedEntry);
  }

  public validSelectedEntries(
    selectedEntries: Array<
      | ItemTableValidation
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContributionValidation
      | ItemTablePayamentCreditPhysicalBeneficiary
      | ItemTablePayamentCreditLegalEntityBeneficiary
    >
  ): Array<
    | ItemTableValidation
    | ItemTableSpecificEvent
    | ItemTableProcess
    | ItemTableMarketingByFarmer
    | ItemTableSocialSecurityContributionValidation
    | ItemTableResourcesReceivedByTheSportsAssociationValidation
    | ItemTableEventByTheSportsAssociation
    | ItemTablePayamentCreditPhysicalBeneficiary
    | ItemTablePayamentCreditLegalEntityBeneficiary
  > {
    return selectedEntries.filter(item => item.status !== 'validated');
  }

  public handleLoadOverlay(status: boolean): void {
    this.loadingOverlay = status;
  }

  public handleButtonActivate(status: boolean): void {
    this.isDisablebutton = status;
  }

  public handleMessageError(status: boolean): void {
    this.messageError = status;
  }

  public validation(event: string): Array<PoTableColumn> {
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
        label: this.literals['table']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_1070(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_2010(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
        width: '20%',
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
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_2020(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_2030(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_2040(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_2050(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
      {
        property: 'totalInvoice',
        label: this.literals['table']['totalItens'],
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
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_2055(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        /*width: '10%',*/
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_4010(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        width: '10%',
      },
      {
        property: 'providerCPF',
        label: this.literals['table']['providerCPF'],
        type: 'number',
        width: '10%',
      },
      {
        property: 'providerName',
        label: this.literals['table']['providerName'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'totalDocs',
        label: this.literals['table']['totalDocs'],
        type: 'number',
        width: '13%',
      },
      {
        property: 'grossAmount',
        label: this.literals['table']['grossAmount'],
        type: 'number',
        width: '10%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxAmount',
        label: this.literals['table']['incomeTaxAmount'],
        type: 'number',
        width: '10%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxBase',
        label: this.literals['table']['incomeTaxBase'],
        type: 'number',
        width: '10%',
        format: '1.2-5',
      },
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_4020(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '12%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
      {
        property: 'branchId',
        label: this.literals['table']['branchId'],
        type: 'string',
        width: '11%',
      },
      {
        property: 'providerCNPJ',
        label: this.literals['table']['providerCNPJ'],
        type: 'number',
        width: '16%',
      },
      {
        property: 'providerName',
        label: this.literals['table']['providerName'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'totalDocs',
        label: this.literals['table']['totalDocs'],
        type: 'number',
        width: '12%',
      },
      {
        property: 'grossAmount',
        label: this.literals['table']['grossAmount'],
        type: 'number',
        width: '13%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxBase',
        label: this.literals['table']['incomeTaxBase'],
        type: 'number',
        width: '13%',
        format: '1.2-5',
      },
      {
        property: 'incomeTaxAmount',
        label: this.literals['table']['incomeTaxAmount'],
        type: 'number',
        width: '13%',
        format: '1.2-5',
      },
      {
        property: 'pisValue',
        label: this.literals['table']['pisValue'],
        type: 'number',
        width: '13%',
        format: '1.2-5',
      },
      {
        property: 'cofinsValue',
        label: this.literals['table']['cofinsValue'],
        type: 'number',
        width: '13%',
        format: '1.2-5',
      },
      {
        property: 'csllValue',
        label: this.literals['table']['csllValue'],
        type: 'number',
        width: '13%',
        format: '1.2-5',
      },
      {
        property: 'agregValue',
        label: this.literals['table']['agregValue'],
        type: 'number',
        width: '13%',
        format: '1.2-5',
      },
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_4040(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '12%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
        width: '33%',
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
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_4080(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '12%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
        width: '33%',
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
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_1050(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '15%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
      {
        property: 'tpEntLig',
        label: this.literals['table']['tpEntLig'],
        type: 'string',
        width: '25%',
      },
      {
        property: 'cnpj',
        label: this.literals['table']['providerCNPJ'],
        type: 'string',
        width: '50%',
      },
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '10%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_2060(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        width: '10%',
        type: 'label',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
        width: '15%',
      },
      {
        property: 'totalInvoice',
        label: this.literals['table']['totalInvoice'],
        width: '15%',
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
        width: '15%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'socialSecurityContributionValueSuspended',
        label: this.literals['table'][
          'socialSecurityContributionValueSuspended'
        ],
        width: '15%',
        type: 'number',
        format: '1.2-5',
        visible: false,
      },
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public R_3010(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: this.literals['table']['status'],
        type: 'label',
        width: '10%',
        labels: [
          {
            value: 'notValidated',
            color: 'primary',
            label: this.literals['table']['pendingValidation'],
          },
          {
            value: 'validated',
            color: 'success',
            label: this.literals['table']['validated'],
          },
        ],
      },
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
      {
        property: 'errors',
        label: this.literals['table']['errorsOrAlerts'],
        width: '7%',
        type: 'icon',
        icons: [
          {
            action: this.showError.bind(this),
            icon: 'po-icon po-icon-exclamation',
            color: this.setChangeTheColorOfTheErrorButton.bind(this),
            tooltip: this.literals['table']['detail'],
            value: 'errors',
            disabled: this.checkError.bind(this),
          },
        ],
      },
    ];
  }

  public async showError(
    items: Array<
      | ItemTableValidation
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContributionValidation
      | ItemTableResourcesReceivedByTheSportsAssociationValidation
      | ItemTablePayamentCreditPhysicalBeneficiary
      | ItemTablePayamentCreditLegalEntityBeneficiary
    >
  ) {
    this.validationErrors = JSON.parse(
      sessionStorage.getItem('TAFLogValidation')
    );

    this.validationErrors.map(log => {
      if (log.error === items['keyValidationErrors'] && log.branchId === items['branchId']) {
        return (this.searchKey = log);
      }
    });
    this.getValidationErrors();
  }

  public checkError(item: PoToolbarAction): boolean {
    return item['keyValidationErrors'] ? false : true;
  }

  public async getValidationErrors(): Promise<void> {
    const payload: PayloadValidationErrors = {
      companyId: await getBranchLoggedIn(),
      event: this.event,
      id: this.searchKey['error'],
    };

    this.handleLoadOverlay(true);

    this.validationPendingService
      .getInfoValidationErrorMessage(payload)
      .subscribe(
        async response => {
          this.handleLoadOverlay(false);
          this.handleMessageError(true);
          this.rowsTextArea =
            (await response.message.replace(/[^\r\n]/g, '').length) / 2;
          if (this.rowsTextArea > 25) {
            this.rowsTextArea = 25
          };
          this.showMessage(response.message);
        },
        error => {
          this.handleLoadOverlay(false);
          this.handleMessageError(true);
          this.poNotificationService.error(error);
        }
      );
  }

  public setChangeTheColorOfTheErrorButton(item): string {
    return item['status'] === 'validated' ? 'color-08' : 'color-07';
  }

  public emitButtonChangeLabel(markedItens: boolean): void {
    this.buttonLabelEmit.emit(markedItens);
  }
}
