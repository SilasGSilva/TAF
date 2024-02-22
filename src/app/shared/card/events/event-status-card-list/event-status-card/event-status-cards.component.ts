import { Component, Output, EventEmitter, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-event-status-card',
  templateUrl: './event-status-card.component.html',
  styleUrls: ['./event-status-card.component.scss']
})
export class EventStatusCardComponent {

  @Input('taf-type') cardType: string;
  @Input('taf-label') cardLabel: string;
  @Input('taf-value') quant: number;
  @Input('taf-primary') isPrimary: boolean;
  @Output('taf-clicked') cardClicked = new EventEmitter<any>();

  @HostListener('click') onClick() {
    this.cardClicked.emit( this.cardType );
  }
}
