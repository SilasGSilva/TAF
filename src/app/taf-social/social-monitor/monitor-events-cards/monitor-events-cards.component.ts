import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  PoCheckboxGroupComponent,
  PoCheckboxGroupOption,
} from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';
import { EventCardItem } from './EventCardItem';

@Component({
  selector: 'app-monitor-events-cards',
  templateUrl: './monitor-events-cards.component.html',
  styleUrls: ['./monitor-events-cards.component.scss'],
})
export class MonitorEventsCardsComponent implements OnInit {
  @Input('taf-event') event: EventCardItem;
  @Input('eventCards') eventCards: Array<EventCardItem>;
  @Input('request') request;

  @ViewChild(PoCheckboxGroupComponent, { static: true })
  checkbox: PoCheckboxGroupComponent;

  @Output('taf-event-selected') eventEmit = new EventEmitter();
  @Output('total') emitTotal = new EventEmitter();
  @Output('taf-event-remove') eventRemoveEmit = new EventEmitter<string>();

  public propertiesOptions: Array<PoCheckboxGroupOption> = [];
  public detailCard = [];
  public literals = {};
  public mark: boolean | null;
  public isDisable: boolean;
  public total: any;
  public selectedCard = false;

  constructor(private literalsService: LiteralService, private router: Router) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit() {
    const { eventCode, status } = this.event;
    const valuePosition: number = status.findIndex(element => element.type === '2');
    const valueTotal: number = valuePosition > -1 ? parseInt(status[valuePosition].value) : 0;

    this.event.total = this.event.total + valueTotal;
    this.detailCard = status;
    this.propertiesOptions.push({
      value: eventCode,
      label: '',
      disabled: false,
    });
    this.isDisable = this.event.total > 0 ? false : true;
  }

  public onClickEvent(status: string = ''): void {
    const { eventCode, eventDescription } = this.event;
    const { period, branches, periodFrom, periodTo, motiveCode } = this.request;
  
    this.getTotal(status);

    const params = {
      event: eventCode,
      description: eventDescription,
      status: status,
      period: period,
      periodFrom: periodFrom,
      periodTo: periodTo,
      motiveCode: motiveCode,
      branches: branches,
      total: this.total,
    };

    if (!this.isDisable && this.total !== 0) {
      this.router.navigate(['monitorDetail'], { queryParams: params });
    }
  }

  public getTotal(status?): void {

    this.event.status.forEach(item =>  {
      if (item.type === status) {
        this.total = item.value;
      }
    });
    if (this.total === undefined) {
      this.total = this.event.total;
    }
     this.emitTotal.emit(this.total);
  }

  public onChangeSelectedEvents($event): void {
    const { eventCode } = this.event;
    this.selectedCard = !this.selectedCard;

    let quantitySelectedEvents = 0;
    const index = this.eventCards.findIndex(card => {
      return card.eventCode === eventCode;
    });

    this.getTotal();

    this.event.checked = $event;

    this.eventCards.forEach(card => {
      if (card.checked) {
        quantitySelectedEvents++;
      }
    });

    this.eventCards[index]['cardObject'] = this;

    quantitySelectedEvents < 1
      ? this.eventEmit.emit(false)
      : this.eventEmit.emit(true);
  }

  public applyClass(): Object {
    return { clickable: this.isDisable ? false : true };
  }
  public applyClassIcon(type: string): string {
    const icon = type === '1' ? 'clock' : 'exclamation';
    return `po-icon po-icon-${icon} font-icon-${icon} po-xl-1 po-lg-1 po-md-1 po-sm-1 po-pl-0`;
  }

  public setPending(card): string {
    let color = '';

    if (card.title === 'Pendente de Envio') {
      if (this.selectedCard && this.mark) {
        color = '#CEC7FF';
      }
    }
    return color;
  }
}
