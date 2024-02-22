import { Component, Input } from '@angular/core';

import { LiteralService } from 'core/i18n/literal.service';

@Component({
  selector: 'app-monitor-totalizer-cards',
  templateUrl: './monitor-totalizer-cards.component.html',
  styleUrls: ['./monitor-totalizer-cards.component.scss']
})
export class MonitorTotalizerCardsComponent {

  public disabledCard = false;
  public literals = {};

  @Input('taf-event') codeEvent: string;
  @Input('taf-description') descriptionEvent: string;
  @Input('taf-total') totalMonitoring: number;

  constructor(private literalsService: LiteralService) {
    this.literals = this.literalsService.literalsTafSocial;
  }

}
