import {
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  PoModalComponent,
  PoNotificationService,
  PoModalAction,
} from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';
import { EventErrorMessageService } from './event-error-message.service';
import { EventErrorsMessageResponse } from '../../models/event-errors-message-response';
import { EventErrorMessageResponse } from '../../models/event-error-message-response';
import { EventError } from '../../models/event-error';
import { getBranchLoggedIn } from '../../../util/util';

@Component({
  selector: 'app-event-error-message',
  templateUrl: './event-error-message.component.html',
  styleUrls: ['./event-error-message.component.scss'],
})
export class EventErrorMessageComponent implements OnInit {
  public literals = {};
  public errorTransmission: Array<EventErrorMessageResponse> = [];
  public errorList: EventErrorsMessageResponse;
  public params = this.activatedRoute.snapshot.queryParams;
  public title: string;
  public modalLoad = false;

  @ViewChild(PoModalComponent) poModal: PoModalComponent;
  @Input('taf-button-message') buttonMessage: string;
  @Output('taf-on-click') buttonClickEmitter = new EventEmitter<any>();

  public primaryAction: PoModalAction;

  constructor(
    private literalService: LiteralService,
    private activatedRoute: ActivatedRoute,
    private eventErrorMessageService: EventErrorMessageService,
    private poNotificationService: PoNotificationService
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.primaryAction = {
      action: () => {
        this.buttonClickEmitter.emit();
        this.poModal.close();
      },
      label: this.buttonMessage
        ? this.buttonMessage
        : this.literals['eventErrorMessage']['close'],
    };
  }

  public async errorDetail(
    errorId: string,
    period?: string,
    event?: string
  ): Promise<void> {
    this.title = errorId;

    const eventError: EventError = {
      companyId: await getBranchLoggedIn(),
      period: period ? period : this.params.period,
      event: event ? event : this.params.event,
      errorId: errorId,
    };

    this.modalLoad = true;

    this.eventErrorMessageService.getMsgErrorGov(eventError).subscribe(
      response => {
        this.setEventsMessage(response.errorTransmission);
        this.errorList = response;
        this.modalLoad = false;
        this.poModal.open();
      },
      error => {
        this.modalLoad = false;
        this.poNotificationService.error(error);
      }
    );
  }

  public setEventsMessage(items: Array<EventErrorMessageResponse>): void {
    items.forEach(item => {
      this.errorTransmission.push(item);
    });
  }
}
