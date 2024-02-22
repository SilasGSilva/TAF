import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  PoNotificationService,
  PoModalComponent,
  PoI18nPipe,
} from '@po-ui/ng-components';

import { LiteralService } from 'literals';
import { SendValidationService } from './send-validation.service';
import { SendValidation } from '../../../../models/send-validation';
import { ItemTableValidation } from '../../../../models/item-table-validation';
import { ItemTableSpecificEvent } from '../../../../models/item-table-specific-event';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableSocialSecurityContribution } from '../../../../models/item-table-social-security-contribution';
import { ItemTableResourcesReceivedByTheSportsAssociationValidation } from '../../../../models/item-table-resources-received-by-the-sports-association-validation';
import { ItemTableEventByTheSportsAssociation } from '../../../../models/item-table-event-by-the-sports-association';
import { ItemTablePayamentCreditPhysicalBeneficiary } from './../../../../models/item-table-payments-credits-physical-beneficiary-validation';
import { ItemTablePayamentCreditLegalEntityBeneficiary } from './../../../../models/item-table-payments-credits-legal-entity-beneficiary-validation';
import { ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary } from '../../../../models/item-table-payments-or-credits-to-unidentified-beneficiary';
import { ItemTableReceiptRetention } from './../../../../models/item-table-receipt-retention';
import { ItemTableRelatedEntity } from './../../../../models/item-table-related-entity';
import { PayloadEventsReinf } from '../../../../../models/payload-events-reinf';
import { getBranchLoggedIn } from '../../../../../../util/util';
import { MessengerComponent } from 'shared/messenger/messenger.component';

@Component({
  selector: 'app-send-validation',
  templateUrl: './send-validation.component.html',
  styleUrls: ['./send-validation.component.scss'],
})
export class SendValidationComponent {
  public taxNumber: string;
  public literals: object;
  public params = this.activatedRoute.snapshot.queryParams;
  public disabledButton = true;
  public selectedEntry: Array<
    | ItemTableValidation
    | ItemTableSpecificEvent
    | ItemTableProcess
    | ItemTableResourcesReceivedByTheSportsAssociationValidation
    | ItemTableMarketingByFarmer
    | ItemTableSocialSecurityContribution
    | ItemTableEventByTheSportsAssociation
    | ItemTablePayamentCreditPhysicalBeneficiary
    | ItemTablePayamentCreditLegalEntityBeneficiary
    | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
    | ItemTableReceiptRetention
    | ItemTableRelatedEntity
  > = [];
  public loadingOverlay = false;
  public statusMessage: string;
  public statusMessageHeader: string;
  public rowsTextArea: number;
  public messageSucess: boolean;
  public labelBtn: string = '';
  public event = this.params.event;
  public validationAll: boolean = ('R-2010|R-2020|R-4010|R-4020|R-4040|R-4080|R-1050').indexOf(this.event) >= 0;

  @ViewChild(PoModalComponent) poModal: PoModalComponent;
  @ViewChild(MessengerComponent, { static: true })
  messengerModal: MessengerComponent;

  @Output('taf-validation-success') validationSuccess = new EventEmitter<
    boolean
  >();
  @Output('taf-validation-errors') validationErrors = new EventEmitter<
    Array<string>
  >();

  constructor(
    private literalsService: LiteralService,
    private activatedRoute: ActivatedRoute,
    private poI18n: PoI18nPipe,
    private poNotificationService: PoNotificationService,
    private sendValidationService: SendValidationService
  ) {
    this.literals = this.literalsService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.enableButton();
    this.labelToMarkedItens(false);
  }

  public async executePenddingValidation(): Promise<void> {
    const customerProviders = [];

    this.loadingOverlay = true;
    if (this.event.match(/R-4010|R-4020/))
    {
      this.selectedEntry.forEach(
      (
        element:
          | ItemTablePayamentCreditPhysicalBeneficiary
          | ItemTablePayamentCreditLegalEntityBeneficiary
      ) => {
        customerProviders.push({ id: element.key, branchId: element.branchId, nif: element.nif ,code: element.providerCode });
      });
    }
    else
    {
      this.selectedEntry.forEach(
      (
        element:
          | ItemTableValidation
          | ItemTableMarketingByFarmer
          | ItemTableSocialSecurityContribution
          | ItemTableEventByTheSportsAssociation
          | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
          | ItemTableReceiptRetention
          | ItemTableRelatedEntity
      ) => {
        customerProviders.push({ id: element.key, branchId: element.branchId });
      });
    }

    const params: PayloadEventsReinf = {
      period: this.params.period,
      event: this.params.event,
      companyId: await getBranchLoggedIn(),
    };
    const payload: SendValidation = { customerProviders: customerProviders };

    this.sendValidationService
      .executePenddingValidation(payload, params)
      .subscribe(
        async response => {
          this.loadingOverlay = false;
          if(!this.validationAll) {
            this.disableButton();
          };
          if (response.success) {
            this.showMessage();
            this.messageSucess = true;
            response.registryKey
              ? this.validationErrors.emit(response.registryKey)
              : this.validationSuccess.emit(true);
          } else {
            this.validationErrors.emit(response.registryKey);
            this.rowsTextArea =
              response.message.replace(/[^\r\n]/g, '').length / 2;
            if (this.rowsTextArea > 25) {
              this.rowsTextArea = 25
            };
            this.messageSucess = false;
            this.setStatusMessage(
              this.literals['sendValidation']['validationFailed'],
              response.message
            );
          }
        },
        error => {
          this.loadingOverlay = false;
          this.poNotificationService.error(error);
        }
      );
  }

  public async showMessage(): Promise<void> {
    const eventFunctionName = this.params.event.replace(/-/g, '_');

    await this[eventFunctionName]();
  }

  public async R_1000(): Promise<void> {
    const quantity = this.selectedEntry.length;
    const { taxNumberFormated } = this
      .selectedEntry[0] as ItemTableSpecificEvent;

    if (quantity === 1) {
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['taxpayer'], taxNumberFormated]
        )
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_1070(): Promise<void> {
    const quantity = this.selectedEntry.length;
    const { proccesNumber } = this.selectedEntry[0] as ItemTableProcess;

    if (quantity === 1) {
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['process'], proccesNumber]
        )
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_2010(): Promise<void> {
    const quantity = this.selectedEntry.length;

    if (quantity === 1) {
      const { taxNumberFormated } = this.selectedEntry[0] as ItemTableValidation;
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['provider'], taxNumberFormated]
        )
      );
    } else {
      this.showSuccessModal();
    };
    this.selectedEntry.length = 0;
  }

  public async R_2020(): Promise<void> {
    const quantity = this.selectedEntry.length;

    if (quantity === 1) {
      const { taxNumberFormated } = this.selectedEntry[0] as ItemTableValidation;
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['client'], taxNumberFormated]
        )
      );
    } else {
      this.showSuccessModal();
    };
    this.selectedEntry.length = 0;
  }

  public async R_2030(): Promise<void> {
    const quantity = this.selectedEntry.length;
    const { taxNumberFormated } = this
      .selectedEntry[0] as ItemTableResourcesReceivedByTheSportsAssociationValidation;

    if (quantity === 1) {
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['client'], taxNumberFormated]
        )
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_2040(): Promise<void> {
    const quantity = this.selectedEntry.length;
    const { taxNumberFormated } = this
      .selectedEntry[0] as ItemTableResourcesReceivedByTheSportsAssociationValidation;

    if (quantity === 1) {
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['client'], taxNumberFormated]
        )
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_2050(): Promise<void> {
    const quantity = this.selectedEntry.length;
    const { taxNumberFormated } = this
      .selectedEntry[0] as ItemTableMarketingByFarmer;

    if (quantity === 1) {
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['taxpayer'], taxNumberFormated]
        )
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_2055(): Promise<void> {
    const quantity = this.selectedEntry.length;
    const { taxNumberFormated } = this
      .selectedEntry[0] as ItemTableMarketingByFarmer;

    if (quantity === 1) {
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['taxpayer'], taxNumberFormated]
        )
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_2060(): Promise<void> {
    const quantity = this.selectedEntry.length;
    const { taxNumberFormated } = this
      .selectedEntry[0] as ItemTableSocialSecurityContribution;

    if (quantity === 1) {
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['client'], taxNumberFormated]
        )
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_3010(): Promise<void> {
    const quantity = this.selectedEntry.length;
    const { newsletterNumber } = (this
      .selectedEntry[0] as unknown) as ItemTableEventByTheSportsAssociation;

    if (quantity === 1) {
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['newsletterNumber'], newsletterNumber]
        )
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_4010(): Promise<void> {
    const quantity = this.selectedEntry.length;
    if (quantity === 1) {
      const { providerName } = this.selectedEntry[0] as ItemTablePayamentCreditPhysicalBeneficiary;

      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['provider'], providerName ]
        )
      );
    } else {
      this.showSuccessModal();
    }
    this.selectedEntry.length = 0;
  }

  public async R_4020(): Promise<void> {
    const quantity = this.selectedEntry.length;
    if (quantity === 1) {
      const { providerName } = this.selectedEntry[0] as ItemTablePayamentCreditLegalEntityBeneficiary;

      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['client'], providerName ]
        )
      );
    } else {
      this.showSuccessModal();
    }
    this.selectedEntry.length = 0;
  }

  public async R_4040(): Promise<void> {
    const quantity = this.selectedEntry.length;
    if (quantity === 1) {
      const { numInsc } = this.selectedEntry[0] as ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary;
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['provider'], numInsc ]
        )
      );
    } else {
      this.showSuccessModal();
    }
    this.selectedEntry.length = 0;
  }

  public async R_4080(): Promise<void> {
    const quantity = this.selectedEntry.length;
    if (quantity === 1) {
      const { numInsc } = this.selectedEntry[0] as ItemTableReceiptRetention;
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['client'], numInsc ]
        )
      );
    } else {
      this.showSuccessModal();
    }
    this.selectedEntry.length = 0;
  }

  public async R_1050(): Promise<void> {
    const quantity = this.selectedEntry.length;
    if (quantity === 1) {
      const { cnpj } = this.selectedEntry[0] as ItemTableRelatedEntity;
      this.setStatusMessage(
        this.literals['sendValidation']['validationSucced'],
        this.poI18n.transform(
          this.literals['sendValidation']['validationSuccedDetail'],
          [this.literals['sendEvent']['entity'], cnpj ]
        )
      );
    } else {
      this.showSuccessModal();
    }
    this.selectedEntry.length = 0;
  }

  public setStatusMessage(messageHeader: string, message: string): void {
    this.statusMessageHeader = messageHeader;
    this.statusMessage = message;

    this.poModal.open();
  }

  public disableButton(): void {
    this.disabledButton = true;
  }

  public enableButton(): void {
    this.disabledButton = false;
  }

  public setSelectedEntry(
    selectedEntry: Array<
      | ItemTableValidation
      | ItemTableSpecificEvent
      | ItemTableProcess
      | ItemTableResourcesReceivedByTheSportsAssociationValidation
      | ItemTableMarketingByFarmer
      | ItemTableSocialSecurityContribution
      | ItemTableEventByTheSportsAssociation
      | ItemTablePayamentCreditPhysicalBeneficiary
      | ItemTablePayamentCreditLegalEntityBeneficiary
      | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
      | ItemTableReceiptRetention
      | ItemTableRelatedEntity
    >
  ): void {
    this.selectedEntry = selectedEntry;
  }

  public showSuccessModal(): void {
    var validationMessage: string = '';

    if (this.labelBtn === this.literals['sendValidation']['toValidationAll']) {
      validationMessage = this.literals['sendValidation']['allValidatedItemsSuccess'];
    } else {
      validationMessage = this.literals['sendValidation']['validationSuccedMessage'];
    };

    this.messengerModal.onShowMessage(
      validationMessage,
      false,
      false,
      this.literals['sendValidation']['validationSucced']
    );
  }

  public labelToMarkedItens(markedItens: boolean): void {
    this.labelBtn = this.literals['sendValidation']['confirmValidation']
    if ( this.validationAll) {
      if (!markedItens) {
        this.labelBtn = this.literals['sendValidation']['toValidationAll'];
      };
    } else {
      this.disableButton();
    };

  }
}
