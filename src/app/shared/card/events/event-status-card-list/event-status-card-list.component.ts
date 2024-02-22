import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PoNotificationService } from '@po-ui/ng-components';

import { LiteralService } from 'literals';
import { CardListService } from './event-status-card-list.service';
import { EventStatusCard } from '../../../../models/event-status-card';
import { ClosingEventService } from 'taf-fiscal/reinf/dashboard/closing-event/closing-event.service';
import { PayloadEventsReinf } from '../../../../models/payload-events-reinf';
import { getBranchLoggedIn } from '../../../../../util/util';

@Component({
  selector: 'app-event-status-card-list',
  templateUrl: './event-status-card-list.component.html',
  styleUrls: ['./event-status-card-list.component.scss'],
})
export class EventStatusCardListComponent implements OnInit {
  public params = this.activatedRoute.snapshot.queryParams;
  public cards: Array<EventStatusCard>;
  public quant: number;
  public literals: object = {};
  public governmentResponse = false;

  @Output('taf-selected') cardSelected = new EventEmitter<string>();
  @Output('taf-return') return = new EventEmitter<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private cardListService: CardListService,
    private closingEventService: ClosingEventService,
    private poNotificationService: PoNotificationService,
    private literalsService: LiteralService
  ) {
    this.literals = this.literalsService.literalsShared;
  }

  ngOnInit() {
    this.loadCardList("",false);
  }

  public async loadCardList(currentStatus: string, monitoringGov: boolean): Promise<void> {
    const cards = [
      {
        type: 'transmitted',
        label: this.literals['eventStatusCardList']['transmitted'],
        quant: 0,
        selected: true,
      },
      {
        type: 'waitingReturn',
        label: this.literals['eventStatusCardList']['waitingReturn'],
        quant: 0,
        selected: false,
      },
      {
        type: 'rejected',
        label: this.literals['eventStatusCardList']['rejected'],
        quant: 0,
        selected: false,
      },
      {
        type: 'authorized',
        label: this.literals['eventStatusCardList']['authorized'],
        quant: 0,
        selected: false,
      },
    ];

    const params: PayloadEventsReinf = {
      companyId: await getBranchLoggedIn(),
      event: this.params.event,
      period: this.params.period,
    };

    if (monitoringGov){
      this.closingEventService.queryingClosedEvent(params).subscribe(
        response => {
          this.governmentResponse = response.success;
          this.getCardList(cards, currentStatus);
        },
        error => {
          this.poNotificationService.error(error);
          this.getCardList(cards, currentStatus);
        }
      );
    }else{
      this.getCardList(cards, currentStatus);
    }

  }

  private emitCardSelected(cardType): void {
    this.cards.forEach(card => {
      card.selected = false;
      if (card.type === cardType) {
        card.selected = true;
      }
    });
    this.cardSelected.emit(cardType);
  }

  private async getCardList(
    cards: Array<EventStatusCard>,
    currentStatus?: string
  ): Promise<void> {
    const cardRequest: PayloadEventsReinf = {
      companyId: await getBranchLoggedIn(),
      event: this.params.event,
      period: this.params.period,
    };

    this.cardListService.getList(cardRequest).subscribe(
      response => {
        cards.forEach(card => {
          card.quant = response[card.type];
        });

        this.cards = cards;
        status = currentStatus ? currentStatus : this.cards[0].type;
        this.emitCardSelected(status);
        this.return.emit(this.governmentResponse);
      },
      error => {
        this.poNotificationService.error(error);
        this.cards = cards;
        status = currentStatus ? currentStatus : this.cards[0].type;
        this.emitCardSelected(status);
        this.return.emit(this.governmentResponse);
      }
    );
  }

  public getQuant(type: string): number {
    return this.cards.find(card => card.type === type).quant;
  }
}
