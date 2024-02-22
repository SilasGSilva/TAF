import { Component, Input } from '@angular/core';
import { LiteralService } from '../../../../core/i18n/literal.service';
import { ListEventsReinfBlock20 } from '../../../../models/list-events-reinf-block-20';
import { ListEventsReinfBlock40 } from '../../../../models/list-events-reinf-block-40';

@Component({
  selector: 'app-totalizer',
  templateUrl: './totalizer.component.html',
  styleUrls: ['./totalizer.component.scss']
})
export class TotalizerComponent {
  public literals: object = {};
  public forceDisabled: boolean = true;
  public eventsBlock20 = ListEventsReinfBlock20;
  public eventsBlock40 = ListEventsReinfBlock40;

  @Input('taf-event') event: string;
  @Input('taf-descriptionEvent') descriptionEvent: string;
  @Input('taf-totalMonitoring') totalMonitoring: string;
  @Input('taf-disabled-card-2099') disabledCard2099: boolean = false;
  @Input('taf-disabled-card-4099') disabledCard4099: boolean = false;

  constructor(private literalService: LiteralService) {
    this.literals = this.literalService.literalsShared;
  }

  public isDisabled(): object {
    if (this.eventsBlock20.hasOwnProperty(this.event) && this.disabledCard2099) {
      return {'color': '#b6bdbf'};
    } else if (this.eventsBlock40.hasOwnProperty(this.event) && this.disabledCard4099) {
      return {'color': '#b6bdbf'};
    }
  }

  public isButtonDisabled(): boolean {
    if ((this.eventsBlock20.hasOwnProperty(this.event) && this.disabledCard2099) || this.forceDisabled) {
      return true;
    } else if ((this.eventsBlock40.hasOwnProperty(this.event) && this.disabledCard4099) || this.forceDisabled) {
      return true;
    } else {
      return false;
    }
  }

}
