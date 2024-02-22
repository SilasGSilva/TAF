import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PoDialogService } from '@po-ui/ng-components';
import { Event } from '../../models/Event';
import { EventCardItem } from '../monitor-events-cards/EventCardItem';
import { EsocialMonitorTransmissionRequest } from '../social-monitor-models/EsocialMonitorTransmissionRequest';
import { LiteralService } from 'core/i18n/literal.service';
import { SocialMonitorService } from '../social-monitor.service';
import { MonitorHeaderActionsService } from './monitor-header-actions.service';
import { MessengerComponent } from 'shared/messenger/messenger.component';

@Component({
  selector: 'app-monitor-header-actions',
  templateUrl: './monitor-header-actions.component.html',
  styleUrls: ['./monitor-header-actions.component.scss'],
})
export class MonitorHeaderActionsComponent implements OnInit {

  @Input('isButtonTransmissionDisabled') isButtonTransmissionDisabled: boolean = false;
  @Input('sendRejected') sendRejected: boolean = false;
  @Input('eventCards') eventCards: Array<EventCardItem>;
  @Input('filters') filters = [];
  @Input('total') total: any;

  @Output() startTransmission = new EventEmitter();
  @Output() finishTransmission = new EventEmitter();
  @Output('hideCounter') hideCounter = new EventEmitter();

  @ViewChild(MessengerComponent, { static: true })
  messengerModal: MessengerComponent;

  public branches = [];
  public period: string = '';
  public literals: object = {};
  public isTAFFull: boolean;
  public showPageLoading: boolean = false;
  public actionOptions: Array<string>;
  public action: string;
  public currentUrl: string;
  public menuContext: string;

  constructor(
    private literalsService: LiteralService,
    private monitorHeaderActionsService: MonitorHeaderActionsService,
    private monitorService: SocialMonitorService,
    public dialogConfirm: PoDialogService,
    private router: Router
  ) {
    this.literals = this.literalsService.literalsTafSocial;

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  ngOnInit() {
    this.isTAFFull = JSON.parse(sessionStorage.getItem('TAFFull'));
    this.menuContext = sessionStorage.getItem('TAFContext');
  }

  public updateMonitorState(value: boolean): void {
    this.monitorService.updateMonitor(value);
  }

  public onClickTransmit(row?): void {
    let quantitySelectedEvents = 0;

    const eventSelected: Event = {
      eventCode: '',
      eventDescription: '',
      permissionEvent: false
    };

    this.startTransmission.emit();

    this.hideCounter.emit(true);

    const companyId = this.monitorService.getCompany();

    const params: EsocialMonitorTransmissionRequest = {
      branches: [],
      events: [],
      companyId: companyId,
      period: '',
      motiveCode: [],
      keys: [],
      user: sessionStorage['TAFUser'],
      periodFrom: '',
      periodTo: '',
      sendRejected: this.sendRejected
    };

    this.filters.forEach(eSocialfilter => {
      if (eSocialfilter.id === 'branch') {
        params.branches.push(eSocialfilter.value);
      } else if (eSocialfilter.id === 'period') {
        params.period = eSocialfilter.value;
      } else if (eSocialfilter.id === 'motive') {
        params.motiveCode.push(eSocialfilter.value);
      } else if (eSocialfilter.id === 'keys') {
        params.keys.push(eSocialfilter.value);
      } else if (eSocialfilter.id === 'periodFrom') {
        params.periodFrom = eSocialfilter.value;
      } else if (eSocialfilter.id === 'periodTo') {
        params.periodTo = eSocialfilter.value;
      }
    });

    this.branches = params.branches;
    this.period = params.period;

    this.eventCards.forEach(card => {
      if (card.checked) {
        quantitySelectedEvents++;
        params.events.push(card.eventCode);
        eventSelected.eventCode = card.eventCode;
        eventSelected.eventDescription = card.eventDescription;
      }
    });

    if (params.keys.length == 0 && row) {
      params.keys.push(row.key);
    }

    this.showPageLoading = true;

    this.monitorHeaderActionsService
      .startTransmission(params, this.menuContext, this.isTAFFull)
      .subscribe(response => {
        if (response.success) {
          this.showPageLoading = false;
          this.finishTransmission.emit();
          if (this.currentUrl === undefined && quantitySelectedEvents < 2) {
            this.confirmDialog(eventSelected);
          } else {
            this.transmissionConfirmed();
            this.updateMonitorState(true);
          }
        } else {
          this.showPageLoading = false;
          this.finishTransmission.emit();
          this.updateMonitorState(true);
          this.messengerModal.onShowMessage(
            response.message,
            false,
            false,
            this.literals['errors']['genericError']
          );
        }
      });

    this.clearCardMark();
  }

  public confirmDialog(eventSelected): void {
    this.dialogConfirm.confirm({
      literals: {
        cancel: this.literals['fgtsReport']['no'],
        confirm: this.literals['fgtsReport']['yes'],
      },
      title: this.literals['monitorGeneral']['transmissionStartSuccess'],
      message: this.literals['monitorGeneral']['viewTransmission'],
      confirm: () => this.redirectToDetails(eventSelected),
    });
  }

  public transmissionConfirmed(): void {
    this.dialogConfirm.alert({
      literals: { ok: this.literals['monitorGeneral']['close'] },
      title: this.literals['monitorGeneral']['transmissionStartSuccess'],
      message: '',
    });
  }

  public redirectToDetails(eventSelected): void {
    const param = {
      event: eventSelected.eventCode,
      description: eventSelected.eventDescription,
      status: '',
      branches: this.branches,
      period: this.period,
      total: this.total,
    };
    this.router.navigate(['monitorDetail'], { queryParams: param });
  }

  public clearCardMark(): void {
    this.eventCards.forEach(card => {
      if (card.hasOwnProperty('cardObject')) {
        card['cardObject'].mark = undefined;
        card['cardObject'].selectedCard = false;
      }
    });
  }
}
