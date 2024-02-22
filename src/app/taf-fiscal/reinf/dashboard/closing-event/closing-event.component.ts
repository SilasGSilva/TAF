import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';
import { LiteralService } from 'literals';
import { ClosingEventService } from './closing-event.service';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { EventErrorMessageComponent } from 'shared/event-error-message/event-error-message.component';
import { PayloadEventsReinf } from './../../../../models/payload-events-reinf';
import { getBranchLoggedIn } from './../../../../../util';

@Component({
  selector: 'app-closing-event',
  templateUrl: './closing-event.component.html',
  styleUrls: ['./closing-event.component.scss'],
})
export class ClosingEventComponent {
  public literals: object = {};
  public statusButton2099: string = '1';
  public statusButton4099: string = '1';
  public protocol2099: string;
  public protocol4099: string;
  public closingEvent2099: boolean = false;
  public closingEvent4099: boolean = false;
  public isLoading2099: boolean = false;
  public isLoading4099: boolean = false;
  public lastEvent: string = '';

  @Input('taf-period') period: string;
  @Input('taf-button-log-period') disableButtonLogPeriod: boolean;
  @Input('taf-r1000-valid') isR1000Valid: boolean;
  @Input('taf-production-restrict') isProductionRestrict: boolean;
  @Input('taf-status-button-closing-period-2099') disableButtonClosingPeriod2099: boolean;
  @Input('taf-status-button-closing-period-4099') disableButtonClosingPeriod4099: boolean;
  @Output('taf-closing-event-emit-2099') closingEventEmit2099 = new EventEmitter<boolean>();
  @Output('taf-closing-event-emit-4099') closingEventEmit4099 = new EventEmitter<boolean>();
  @Output('taf-remove-company-loading') loadingRemoveCompanyEmit = new EventEmitter<boolean>();

  @ViewChild(EventErrorMessageComponent) eventErrorMessage: EventErrorMessageComponent;
  @ViewChild(MessengerComponent, { static: true }) messengerModal: MessengerComponent;

  constructor(
    private literalService: LiteralService,
    private closingEventService: ClosingEventService,
    private poNotificationService: PoNotificationService
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  public onClosing(): void {
    if (this.eventErrorMessage.hasOwnProperty("errorList")
        && this.eventErrorMessage.errorList.hasOwnProperty("errorTransmission")
        && typeof(this.eventErrorMessage.errorList.errorTransmission) === 'object'
        && this.eventErrorMessage.errorList.errorTransmission.length === 1
        && this.eventErrorMessage.errorList.errorTransmission[0].hasOwnProperty("code")
        && typeof(this.eventErrorMessage.errorList.errorTransmission[0].code) === 'string') {
      if (this.eventErrorMessage.errorList.errorTransmission[0].code.replace(/\s/g, "") === '2EMPROCESSAMENTO') {
        this.statusButton2099 = '3'; //Habilita o botão consultar fechamento, após fechar o modal com o erro 2 EM PROCESSAMENTO
        this.eventErrorMessage.errorList.errorTransmission = []; //Limpa objeto, para evitar conflito, caso mude de período e consulte novamente
      }
    }
  }

  public onCloseButton(event: string): void {
    if (event === 'R-2099') {
      this.statusButton2099 = '2';
      this.closingEvent2099 = true;
      this.closingEventEmit2099.emit(this.closingEvent2099);
    } else {
      this.statusButton4099 = '2';
      this.closingEvent4099 = true;
      this.closingEventEmit4099.emit(this.closingEvent4099);
    }
  }

  public onCancel(event: string): void {
    if (event === 'R-2099') {
      this.statusButton2099 = '1';
      this.closingEvent2099 = false;
      this.closingEventEmit2099.emit(this.closingEvent2099);
    } else {
      if (event === 'R-2098') {
          this.statusButton2099 = '4';
      } else {
        if (this.statusButton4099 === '6') {
          this.statusButton4099 = '4';
        } else {
          this.statusButton4099 = '1';
          this.closingEvent4099 = false;
          this.closingEventEmit4099.emit(this.closingEvent4099);
        }
      }
    }
  }

  public onReopening(event: string): void {
    if (event.match(/R-2098|R-2099/)) {
      this.statusButton2099 = '6';
    } else {
      this.statusButton4099 = '6';
    }
  }

  public onTransmitting(event: string): void {
    if (event.match(/R-2098|R-2099/)) {
      this.isLoading2099 = true;
    } else {
      this.isLoading4099 = true;
    }

    this.closingPeriod(event);
    this.disableButtonLogPeriod = true;
  }

  public statusTSS(): void {
    this.onQuerying(this.lastEvent);
  }

  public async closingPeriod(event: string): Promise<void> {
    const params: PayloadEventsReinf = {
      companyId: await getBranchLoggedIn(),
      period: this.period,
      event: event,
    };

    this.lastEvent = event;

    this.closingEventService.closingEvent(params).subscribe(
      response => {
        if (event.match(/R-2098|R-2099/)) {
          this.isLoading2099 = false;
        } else {
          this.isLoading4099 = false;
        }

        if (response.success) {
          switch (event) {
            case 'R-2098':
              this.statusButton2099 = '5';
              break;
            case 'R-2099':
              this.statusButton2099 = '3';
              break;
            case 'R-4099':
              if (this.statusButton4099 === '2') {
                this.statusButton4099 = '3';
              } else {
                this.statusButton4099 = '5';
              }
              break;
          }

          this.messengerModal.onShowMessage(
            response.message,
            false,
            false,
            this.literals['closingEvent']['validationSucced']
          );
        } else if (
          response.message.includes(
            this.literals['closingEvent']['connectionFail']
          )
        ) {
          this.messengerModal.onShowMessage(
            response.message,
            false,
            false,
            this.literals['closingEvent']['connectionFail']
          );
        } else {
          this.messengerModal.onShowMessage(
            response.message,
            false,
            false,
            this.literals['closingEvent']['validationFailed']
          );
        }
      },
      error => {
        if (event.match(/R-2098|R-2099/)) {
          this.isLoading2099 = false;
        } else {
          this.isLoading4099 = false;
        }

        this.messengerModal.onShowMessage(
          error,
          false,
          false,
          this.literals['closingEvent']['validationFailed']
        );
      }
    );
  }

  public async onQuerying(event: string): Promise<void> {
    const params: PayloadEventsReinf = {
      companyId: await getBranchLoggedIn(),
      event: event,
      period: this.period,
    };

    if (event.match(/R-2098|R-2099/)) {
      this.isLoading2099 = true;
    } else {
      this.isLoading4099 = true;
    }

    this.closingEventService.queryingClosedEvent(params).subscribe(
      response => {
        if (event.match(/R-2098|R-2099/)) {
          this.isLoading2099 = false;
        } else {
          this.isLoading4099 = false;
        }

        if (response.success) {
          this.poNotificationService.success(response.message);

          switch (event) {
            case 'R-2098':
              this.statusButton2099 = '1';
              this.closingEvent2099 = false;
              this.closingEventEmit2099.emit(this.closingEvent2099);
              this.protocol2099 = '';
              this.onClosing();
              break;
            case 'R-2099':
              this.statusButton2099 = '4';
              this.closingEvent2099 = true;
              this.closingEventEmit2099.emit(this.closingEvent2099);
              this.protocol2099 = response.protocol;
              break;
            case 'R-4099':
              if (this.statusButton4099 === '3') {
                this.statusButton4099 = '4';
                this.closingEvent4099 = true;
                this.closingEventEmit4099.emit(this.closingEvent4099);
                this.protocol4099 = response.protocol;
              } else {
                this.statusButton4099 = '1';
                this.closingEvent4099 = false;
                this.closingEventEmit4099.emit(this.closingEvent4099);
                this.protocol4099 = '';
              }
              break;
          }

          this.disableButtonLogPeriod = true;
        } else {
          if (response.errorid) {
            this.disableButtonLogPeriod = false;

            switch (event) {
              case 'R-2098':
                this.statusButton2099 = '4';
                break;
              case 'R-2099':
                this.statusButton2099 = '1';
                this.closingEvent2099 = false;
                this.closingEventEmit2099.emit(this.closingEvent2099);
                break;
              case 'R-4099':
                if (this.statusButton4099 === '3') {
                  this.statusButton4099 = '1';
                  this.closingEvent4099 = false;
                  this.closingEventEmit4099.emit(this.closingEvent4099);
                } else {
                  this.statusButton4099 = '4';
                }
                break;
            }

            this.eventErrorMessage.errorDetail(
              response.errorid.toString(),
              this.period,
              event
            );
          } else {
            this.poNotificationService.warning(response.message);
          }
        }
      },
      error => {
        if (event.match(/R-2098|R-2099/)) {
          this.isLoading2099 = false;
        } else {
          this.isLoading4099 = false;
        }

        this.poNotificationService.error(error);
      }
    );
  }

  public setStatusButtonLogPeriod(statusPeriod: boolean){
    this.disableButtonLogPeriod = statusPeriod;
  }

  public setStatusButtonClosingPeriod2099(statusButton: boolean) {
    this.disableButtonClosingPeriod2099 = statusButton;
  }

  public setStatusButtonClosingPeriod4099(statusButton: boolean) {
    this.disableButtonClosingPeriod4099 = statusButton;
  }

  public setStatusPeriod(statusPeriod2099: string, protocol2099: string, statusPeriod4099: string, protocol4099: string): void {

    switch (statusPeriod2099) {
      case 'open':
        this.statusButton2099 = '1';
        this.closingEvent2099 = false;
        this.protocol2099 = '';
        break;
      case 'waitingClosing':
        this.statusButton2099 = '3';
        this.closingEvent2099 = true;
        this.protocol2099 = '';
        break;
      case 'closed':
        this.statusButton2099 = '4';
        this.closingEvent2099 = true;
        this.protocol2099 = protocol2099;
        break;
      case 'waitingReopening':
        this.statusButton2099 = '5';
        this.closingEvent2099 = true;
        this.protocol2099 = protocol2099;
        break;
    }

    switch (statusPeriod4099) {
      case 'open':
        this.statusButton4099 = '1';
        this.closingEvent4099 = false;
        this.protocol4099 = '';
        break;
      case 'waitingClosing':
        this.statusButton4099 = '3';
        this.closingEvent4099 = true;
        this.protocol4099 = '';
        break;
      case 'closed':
        this.statusButton4099 = '4';
        this.closingEvent4099 = true;
        this.protocol4099 = protocol4099;
        break;
      case 'waitingReopening':
        this.statusButton4099 = '5';
        this.closingEvent4099 = true;
        this.protocol4099 = protocol4099;
        break;
    }

    this.closingEventEmit2099.emit(this.closingEvent2099);
    this.closingEventEmit4099.emit(this.closingEvent4099);
  }

  public emitLoadingRemoveCompany(loading:boolean){
    this.loadingRemoveCompanyEmit.emit(loading);
  }
}
