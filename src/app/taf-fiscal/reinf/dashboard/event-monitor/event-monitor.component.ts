import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PoBreadcrumbItem, PoModalAction, PoNotificationService } from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';
import { EventStatusCardListComponent } from 'shared/card/events/event-status-card-list/event-status-card-list.component';
import { EventMonitorTableComponent } from './event-monitor-table/event-monitor-table.component';
import { EventDescriptionService } from 'shared/event-description/event-description.service';
import { EventDescription } from '../../../../models/event-description';
import { DeleteEventDialogComponent } from './../../../../shared/delete-event-dialog/delete-event-dialog.component';
import { EventMonitorService } from './event-monitor.service';
import { PayloadDeleteEvent } from '../../../../models/payload-delete-event';
import { getBranchLoggedIn, valueIsNull } from '../../../../../util/util';
import { ListEventsDelete } from 'taf-fiscal/models/list-events-delete';
import { ListEventsRelay } from 'taf-fiscal/models/list-events-relay';
import { SendEventComponent } from 'taf-fiscal/reinf/dashboard/transmission/send-event/send-event.component';
import { SendEventService } from 'taf-fiscal/reinf/dashboard/transmission/send-event/send-event.service';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { PayloadEventsReinf } from '../../../../models/payload-events-reinf';
import { ItemTable } from '../../../models/item-table';
import { ItemTableSpecificEvent } from '../../../models/item-table-specific-event';
import { ItemTableProcess } from '../../../models/item-table-process';
import { ItemTableMarketingByFarmer } from '../../../models/item-table-marketing-by-farmer';
import { ItemTableSocialSecurityContribution } from '../../../models/item-table-social-security-contribution';
import { ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation } from '../../../models/item-table-details-resources-passed-on-the-by-the-sports-association';
import { ItemTableResourcesReceivedByTheSportsAssociation } from '../../../models/item-table-resources-received-by-the-sports-association';

@Component({
  selector: 'app-event-monitor',
  templateUrl: './event-monitor.component.html',
  styleUrls: ['./event-monitor.component.scss'],
})
export class EventMonitorComponent implements OnInit {
  public stepperItems: Array<PoBreadcrumbItem>;
  public params = this.activatedRoute.snapshot.queryParams;
  public literals = {};
  public currentStatus = 'transmitted';
  public statusDescription = 'Rejeitados';
  public statusEnvironment: string;
  public governmentReturn = true;
  public deleteEvent = true;
  public relayButton = false;
  public loadingButton = false;
  public loadingOverlay = false;
  public lastUpdate: number;
  public primaryAction: PoModalAction;
  public secondaryAction: PoModalAction;
  public deleteAndTransmit: boolean;
  public isDisableButton = true;
  public EVENTS_REINF_DELETE = ListEventsDelete;
  public EVENTS_REINF_RELAY = ListEventsRelay;
  public period = this.activatedRoute.snapshot.queryParams.period;
  public event = this.activatedRoute.snapshot.queryParams.event;
  public isLoading = false;

  currentFriend: object;

  public actions: Array<object>;
  public selectedEntry: Array<any>;

  @Output('taf-emit-sent') emitSent = new EventEmitter<any>();

  @ViewChild(EventStatusCardListComponent)
  eventStatusCardList: EventStatusCardListComponent;
  @ViewChild(EventMonitorTableComponent)
  eventMonitorTable: EventMonitorTableComponent;
  @ViewChild(DeleteEventDialogComponent, { static: true })
  modalDelete: DeleteEventDialogComponent;
  @ViewChild(SendEventComponent)
  sendEvent: SendEventComponent;
  @ViewChild(MessengerComponent, { static: true })
  messengerModal: MessengerComponent;

  @Input('taf-events') events: Array<
    | ItemTable
    | ItemTableSpecificEvent
    | ItemTableProcess
    | ItemTableMarketingByFarmer
    | ItemTableSocialSecurityContribution
    | ItemTableResourcesReceivedByTheSportsAssociation
    | ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation
  > = [];

  @Input('taf-description') description: string;
  constructor(
    private literalsService: LiteralService,
    private activatedRoute: ActivatedRoute,
    private eventDescriptionService: EventDescriptionService,
    private eventMonitorService : EventMonitorService,
    private poNotification: PoNotificationService,
    private sendEventService: SendEventService,
    private poNotificationService: PoNotificationService,

  ) {
    this.literals = this.literalsService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.loadingOverlay = true;
    this.isDisableButton = true;
    this.events = [];

    this.stepperItems = [
      { label: this.literals['eventMonitor']['eventsMonitor'] },
      { label: this.literals['eventMonitor']['following'] },
    ];
    this.getDescription({ eventDesc: this.params.event });

    this.actions = [
      { label: this.literals['deleteEvent']['buttonDelete'], action: this.deleteEvento.bind(this,false) },
      { label: this.literals['deleteEvent']['buttonDeleteSend'], action: this.deleteEvento.bind(this,true) },
    ];

  }

  public getDescription(eventDescription: EventDescription): void {
    this.eventDescriptionService
      .getDescription(eventDescription)
      .subscribe(res => (this.description = res.description));
  }

  public setStatus(status: string): void {
    this.currentStatus = status;

    this.statusDescription = this.literals['eventMonitor']['status'];

    if (
      status === 'waitingReturn' &&
      this.eventStatusCardList.getQuant(status) > 0
    ) {
      this.governmentReturn = false;
    } else {
      this.governmentReturn = true;
    }

    if (
      status === 'authorized' &&
      this.eventStatusCardList.getQuant(status) > 0
    ) {
      this.deleteEvent = false;
    } else {
      this.deleteEvent = true;
    }

  }

  public queryGovernment(): void {
    this.loadingOverlay = true;
    this.loadingButton = true;
    this.eventStatusCardList.loadCardList(this.currentStatus,true);
    this.lastUpdate = Date.now();
    this.governmentReturn = true;
  }

  public toggleButton(event): void {
    this.loadingButton = false;
    this.governmentReturn = true;

    if (!event && this.eventStatusCardList.getQuant(status) > 0) {
      this.governmentReturn = false;
    }

    this.eventMonitorTable.loadTable();

    this.loadingOverlay = false;
  }

  public toggleDropDownButton(disable: boolean): void {
    disable
      ? this.disableButton()
      : this.enableButton();
  }

  public deleteEvento(transmit: boolean): void{

    this.loadingButton = true;
    this.loadingOverlay = true;

    const title = transmit ? this.literals['deleteEvent']['buttonDeleteSend'] : this.literals['deleteEvent']['buttonDelete'];

    this.primaryAction = {
      action: async () => {
        const payload: PayloadDeleteEvent = {
          event: this.params.event,
          transmit: transmit,
          period: this.params.period,
          companyId: await getBranchLoggedIn(),
        };

        this.loadingButton = true;
        this.loadingOverlay = true;
        this.disableButton();
        this.modalDelete.close();
        let errMsg  = "";
        let message = "";
        let hasError = 0;
        let hasOk = 0;
        let typeNotification = 'success';
        const eventsItems = [];

        this.selectedEntry.forEach(items => {
          eventsItems.push({ id: items['key'] });
        });

        this.eventMonitorService.deleteEvent({deleteItems : eventsItems},payload)
        .subscribe(
          response => {
            this.loadingButton = false;
            this.loadingOverlay = false;
            response.deletedDetail.forEach(items => {
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
              typeNotification = 'warning';
            }else if (hasError > 0 && hasOk == 0) {
              message = errMsg;
              typeNotification = 'error';
            }

            this.notification( typeNotification, message )

            this.updateCards();
          },
          error => {
            this.loadingButton = false;
            this.loadingOverlay = false;
            //this.modalDelete.close();
            if (!valueIsNull(error.error.errorMessage)){
              errMsg = error.error.errorMessage;
            }else {
              errMsg = this.literals['deleteEvent']['error'];
            }

            this.notification('error', errMsg );
            this.enableButton();
          }
        );
      },
      label: this.literals['deleteEvent']['buttonConfirm'] ,
      danger: false,
      loading: false,
    };

    this.secondaryAction = {
      action: () => {
        this.loadingButton = false;
        this.loadingOverlay = false;
        this.modalDelete.close();
        this.notification( 'warning', this.literals['deleteEvent']['canceled'] )
      },
      label: this.literals['deleteEvent']['buttonCancel'] ,
      danger: false,
      loading: false
    };


    this.modalDelete.onOpenDialog(this.primaryAction,this.secondaryAction,title);
  }

  private notification( notificationType: string,message: string) {
    this.poNotification[notificationType](message);

  }

  public updateCards(): void {
    this.loadingOverlay = true;
    this.loadingButton = true;

    this.eventStatusCardList.loadCardList(this.currentStatus,true);
  }

  public disableButton(): void {
    this.isDisableButton = true;
  }

  public enableButton(): void {
    this.isDisableButton = false;
  }

  public enableButtonDelete(): boolean{
    let retEnableButton = false;
    if (this.EVENTS_REINF_DELETE.hasOwnProperty(this.params.event) && this.currentStatus === 'authorized') {
      retEnableButton = true;
    }
    return retEnableButton;
  }

  public enableButtonRelay(): boolean{
    let retEnableButton = false;
    if (this.EVENTS_REINF_RELAY.hasOwnProperty(this.params.event) && this.currentStatus === 'rejected') {
      retEnableButton = true;
    }
    return retEnableButton;
  }

  public async relayEvent(): Promise<void> {
    const eventsItems = [];
    const params: PayloadEventsReinf = {
      companyId: await getBranchLoggedIn(),
      period: this.period,
      event: this.event,
    };
    this.loadingButton = true;
    this.loadingOverlay = true;
    this.disableButton();
    this.modalDelete.close();
    let message = "";
    let typeNotification = 'success';

    this.selectedEntry.forEach(items => {
      eventsItems.push({ id: items['key'] });
    });

    this.sendEventService
      .send({ transmissionItems: eventsItems }, params)
      .subscribe(
        response => {
          this.loadingButton = false;
          this.loadingOverlay = false;

          if(response.status){
            message = 'Evento transmitido com sucesso.';
            typeNotification = 'success';
          }else if (!response.status) {
            message = response.message;
            typeNotification = 'error';
          }

          this.notification( typeNotification, message )
          this.updateCards();
        },
        error => {
          this.loadingButton = false;
          this.loadingOverlay = false;
          this.poNotificationService.error(error);
        }
      );
  }

  public async showMessage(): Promise<void> {
    const eventFunctionName = this.event.replace(/-/g, '_');

    await this[eventFunctionName]();
  }

  public showTitleModal(title: number): string {
    const titles = [
      'errorNotIdentified',
      'schemaError',
      'cannotAccessTSS',
      'predecessionErro',
    ];
    return titles[title];
  }
}

