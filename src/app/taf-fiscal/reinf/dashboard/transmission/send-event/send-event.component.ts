import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  PoModalComponent,
  PoModalAction,
  PoNotificationService,
  PoI18nPipe,
} from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';
import { SendEventService } from './send-event.service';
import { ItemTable } from '../../../../models/item-table';
import { ItemTableSpecificEvent } from '../../../../models/item-table-specific-event';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableSocialSecurityContribution } from '../../../../models/item-table-social-security-contribution';
import { ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation } from '../../../../models/item-table-details-resources-passed-on-the-by-the-sports-association';
import { ItemTableResourcesReceivedByTheSportsAssociation } from '../../../../models/item-table-resources-received-by-the-sports-association';
import { ItemTableEventByTheSportsAssociation } from '../../../../models/item-table-event-by-the-sports-association';
import { ItemTablePayamentCreditPhysicalBeneficiary } from './../../../../models/item-table-payments-credits-physical-beneficiary-validation';
import { PayloadEventsReinf } from '../../../../../models/payload-events-reinf';
import { DialogYesNoComponent } from 'shared/dialog-yes-no/dialog-yes-no.component';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { getBranchLoggedIn, valueIsNull } from '../../../../../../util/util';
import { PayloadUndeleteReinf } from '../../../../../models/payload-undelete-reinf';
import { ItemTablePaymentsOrCreditsToIndividualBeneficiary } from './../../../../models/item-table-payments-or-credits-to-individual-beneficiary';
import { ItemTablePaymentsOrCreditsToLegalEntityBeneficiary } from './../../../../models/item-table-payments-or-credits-to-legal-entity-beneficiary';
import { ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary } from './../../../../models/item-table-payments-or-credits-to-unidentified-beneficiary';
import { ItemTableReceiptRetention } from './../../../../models/item-table-receipt-retention';
import { ItemTableRelatedEntity } from './../../../../models/item-table-related-entity';

@Component({
  selector: 'app-send-event',
  templateUrl: './send-event.component.html',
  styleUrls: ['./send-event.component.scss'],
})
export class SendEventComponent implements OnInit {
  public period = this.activatedRoute.snapshot.queryParams.period;
  public event = this.activatedRoute.snapshot.queryParams.event;
  public isR9000: boolean;
  public isR2055RCP: boolean = false;
  public transmitAll: boolean = false;
  public labelbtn: string;
  public isLoading = false;
  public isUndelete = false;
  public disabled = true;
  public statusMessage: string;
  public statusMessageHeader: string;
  public transmissionSucced: string;
  public transmissionSuccedMessage: string;
  public transmissionSuccedDetail: string;
  public literals: object = {};
  public primaryAction: PoModalAction;
  public secondaryAction: PoModalAction;

  @Input('taf-events') events: Array<
    | ItemTable
    | ItemTableSpecificEvent
    | ItemTableProcess
    | ItemTableMarketingByFarmer
    | ItemTableSocialSecurityContribution
    | ItemTableResourcesReceivedByTheSportsAssociation
    | ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation
    | ItemTablePayamentCreditPhysicalBeneficiary
    | ItemTablePaymentsOrCreditsToIndividualBeneficiary
    | ItemTablePaymentsOrCreditsToLegalEntityBeneficiary
    | ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary
    | ItemTableReceiptRetention
    | ItemTableRelatedEntity
  > = [];

  @Output('taf-emit-sent') emitSent = new EventEmitter<any>();

  @ViewChild(PoModalComponent) poModal: PoModalComponent;

  @ViewChild(MessengerComponent, { static: true }) messengerModal: MessengerComponent;

  @ViewChild(DialogYesNoComponent, { static: true }) modalYesNo: DialogYesNoComponent;

  constructor(
    private literalsService: LiteralService,
    private poI18n: PoI18nPipe,
    private sendEventService: SendEventService,
    private activatedRoute: ActivatedRoute,
    private poNotificationService: PoNotificationService
  ) {
    this.literals = this.literalsService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.events = [];

    this.transmissionSucced = this.literals['sendEvent']['transmissionSucced'];
    this.transmissionSuccedMessage = this.literals['sendEvent'][
      'transmissionSuccedMessage'
    ];
    this.transmissionSuccedDetail = this.literals['sendEvent'][
      'transmissionSuccedDetail'
    ];
    this.isR9000 = this.event === "R-9000";
    this.isR2055RCP = (this.event.match(/R-1050|R-2010|R-2020|R-2055|R-4010|R-4020|R-4040|R-4080/));

    if (this.isR2055RCP){
      this.labelbtn = this.literals['sendEvent']['toTransmitAll'];
      this.transmitAll = true;
      this.disabled = false;
    }
  }

  public async undelete(): Promise<void> {
    const eventsItems = [];
    const params: PayloadUndeleteReinf = {
      companyId: await getBranchLoggedIn(),
      period: this.period,
    };
    this.isUndelete = true;
    this.events.forEach(items => {
      eventsItems.push({ id: items['key'] });
    });
    this.sendEventService
    .undelete({ undeleteItems: eventsItems }, params)
    .subscribe(
      response => {
        this.isUndelete = false;
        this.disableButton();
        let errMsg   = "";
        let message  = "";
        let hasError = 0;
        let hasOk    = 0;
        response.undeletedDetail.forEach(items => {
          if (!items.status ){
            hasError++;
            errMsg = items.message ;
          }else{
            hasOk++;
            message = items.message;
          }
        });
        if(hasError > 0 && hasOk > 0){
          message = errMsg;
        } else if (hasError > 0 && hasOk == 0) {
          message = errMsg;
        }
        this.messengerModal.onShowMessage(
          message,
          false,
          false,
          this.literals['deleteEvent']['toDelete']
        );
        this.emitSent.emit(true);
        this.poNotificationService.information(this.literals['deleteEvent']['infoCard']);
      },
      error => {
        this.isUndelete = false;
        this.emitSent.emit(true);
        this.poNotificationService.error(error);
      }
    );
  }

  public async sendAll(): Promise<void> {
    const title = "Transmissão";
    var text = this.literals['sendEvent']['msgChecked'];

    if(this.isR2055RCP && this.transmitAll ) {
      text = this.literals['sendEvent']['msgAll'];
    }

    this.primaryAction = {
      action: async () => {
        this.modalYesNo.close();
        this.send();
      },
      label: this.literals['sendEvent']['yes'],
      danger: false,
      loading: false
    };
    this.secondaryAction = {
      action: () => {
        this.modalYesNo.close();
      },
      label: this.literals['sendEvent']['no'],
      danger: false,
      loading: false
    };
    this.modalYesNo.onOpenDialog( this.primaryAction, this.secondaryAction, title, text);
  }

  public async send(): Promise<void> {
    const eventsItems = [];
    const params: PayloadEventsReinf = {
      companyId: await getBranchLoggedIn(),
      period: this.period,
      event: this.event,
    };

    this.isLoading = true;
    if(this.isR2055RCP && this.transmitAll ) {
      eventsItems.push({ id: 'All' });
    } else {
      this.events.forEach(items => {
        eventsItems.push({ id: items['key'] });
      });
    }

    this.sendEventService
      .send({ transmissionItems: eventsItems }, params)
      .subscribe(
        response => {
          this.isLoading = false;
          this.disableButton();

          response.status
            ? this.showMessage()
            : this.messengerModal.onShowMessage(
                response.message,
                false,
                false,
                this.literals['errors'][this.showTitleModal(response.type)]
              );

          this.emitSent.emit(true);

          if (this.isR2055RCP) {
            this.labelbtn = this.literals['sendEvent']['toTransmitAll'];
            this.transmitAll = true;
          }
          this.events = [];
        },
        error => {
          this.isLoading = false;
          this.emitSent.emit(true);
          if (!valueIsNull(error.error.errorMessage)) {
            this.poNotificationService.error(error.error.errorMessage);
          }else{
            this.poNotificationService.error(error)
          }
        }
      );
  }

  public async showMessage(): Promise<void> {
    const eventFunctionName = this.event.replace(/-/g, '_');

    await this[eventFunctionName]();
  }

  public async R_1000(): Promise<void> {
    const quantity = this.events.length;
    const { taxNumberFormated } = this.events[0] as ItemTableSpecificEvent;

    if (quantity === 1) {
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['taxpayer'],
          taxNumberFormated,
        ])
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_1070(): Promise<void> {
    const quantity = this.events.length;
    const { proccesNumber } = this.events[0] as ItemTableProcess;

    if (quantity === 1) {
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['process'],
          proccesNumber,
        ])
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_1050(): Promise<void> {
    const quantity = this.events.length;
    const { cnpj } = this.events[0] as ItemTableRelatedEntity;

    if (quantity === 1) {
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['entity'],
          cnpj,
        ])
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_2010(): Promise<void> {
    const quantity = this.events.length;

    if (quantity === 1) {
      const { taxNumberFormated } = this.events[0] as ItemTable;
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['provider'],
          taxNumberFormated,
        ])
      );
    } else {
      this.showSuccessModal(this.events.length===0);
    }
  }

  public async R_2020(): Promise<void> {
    const quantity = this.events.length;

    if (quantity === 1) {
      const { taxNumberFormated } = this.events[0] as ItemTable;
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['client'],
          taxNumberFormated,
        ])
      );
    } else {
      this.showSuccessModal(this.events.length===0);
    }
  }

  public async R_2030(): Promise<void> {
    const quantity = this.events.length;
    const { taxNumberFormated } = this
      .events[0] as ItemTableResourcesReceivedByTheSportsAssociation;

    if (quantity === 1) {
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['client'],
          taxNumberFormated,
        ])
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_2040(): Promise<void> {
    const quantity = this.events.length;
    const { taxNumberFormated } = this
      .events[0] as ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation;

    if (quantity === 1) {
      this.setStatusMessage(
        this.literals['sendEvent']['transmissionSucced'],
        this.poI18n.transform(
          this.literals['sendEvent']['transmissionSuccedDetail'],
          [this.literals['sendEvent']['client'], taxNumberFormated]
        )
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_2050(): Promise<void> {
    const quantity = this.events.length;
    const { taxNumberFormated } = this.events[0] as ItemTableMarketingByFarmer;

    if (quantity === 1) {
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['taxpayer'],
          taxNumberFormated,
        ])
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_2055(): Promise<void> {
    const quantity = this.events.length;

    if (quantity === 1) {
      const { taxNumberFormated } = this.events[0] as ItemTableMarketingByFarmer;
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['taxpayer'],
          taxNumberFormated,
        ])
      );
    } else {
      this.showSuccessModal(this.events.length===0);
    }
  }

  public async R_2060(): Promise<void> {
    const quantity = this.events.length;
    const { taxNumberFormated } = this
      .events[0] as ItemTableSocialSecurityContribution;

    if (quantity === 1) {
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['taxpayer'],
          taxNumberFormated,
        ])
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_3010(): Promise<void> {
    const quantity = this.events.length;
    const { newsletterNumber } = (this
      .events[0] as unknown) as ItemTableEventByTheSportsAssociation;

    if (quantity === 1) {
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['newsletterNumber'],
          newsletterNumber,
        ])
      );
    } else {
      this.showSuccessModal();
    }
  }

  public async R_4010(): Promise<void> {
    const quantity = this.events.length;

    if (quantity === 1) {
      const { cpf } = this.events[0] as ItemTablePaymentsOrCreditsToIndividualBeneficiary;
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['beneficiary'],
          cpf,
        ])
      );
    } else {
      this.showSuccessModal(this.events.length===0);
    }
  }

  public async R_4020(): Promise<void> {
    const quantity = this.events.length;

    if (quantity === 1) {
      const { cnpj } = this.events[0] as ItemTablePaymentsOrCreditsToLegalEntityBeneficiary;
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['beneficiary'],
          cnpj,
        ])
      );
    } else {
      this.showSuccessModal(this.events.length===0);
    }
  }

  public async R_4040(): Promise<void> {
    const quantity = this.events.length;

    if (quantity === 1) {
      const { numInsc } = this.events[0] as ItemTablePaymentsOrCreditsToUnidentifiedBeneficiary;
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['taxpayer'],
          numInsc,
        ])
      );
    } else {
      this.showSuccessModal(this.events.length===0);
    }
  }

  public async R_4080(): Promise<void> {
    const quantity = this.events.length;

    if (quantity === 1) {
      const { numInsc } = this.events[0] as ItemTableReceiptRetention;
      this.setStatusMessage(
        this.transmissionSucced,
        this.poI18n.transform(this.transmissionSuccedDetail, [
          this.literals['sendEvent']['fontName'],
          numInsc,
        ])
      );
    } else {
      this.showSuccessModal(this.events.length===0);
    }
  }
  public showSuccessModal(sendAll: boolean = false): void {
    const transmissionSucced = this.literals['sendEvent']['transmissionSucced'];
    let transmissionSuccedMessage = this.literals['sendEvent']['transmissionSuccedMessage'];
    if (sendAll){
      transmissionSuccedMessage = this.literals['sendEvent']['transmissionAllSuccedMessage'];
    }
    this.messengerModal.onShowMessage(
      transmissionSuccedMessage,
      false,
      false,
      transmissionSucced
    );
  }
  public setStatusMessage(messageHeader: string, message: string): void {
    this.statusMessageHeader = messageHeader;
    this.statusMessage = message;

    this.poModal.open();
  }

  public disableButton(): void {
    this.disabled = true;
  }

  public enableButton(): void {
    this.disabled = false;
  }

  public showTitleModal(title: number): string {
    const titles = [
      'errorNotIdentified',
      'schemaError',
      'cannotAccessTSS',
      'predecessionErro',
      'tokenTSS',
    ];
    return titles[title];
  }
}
