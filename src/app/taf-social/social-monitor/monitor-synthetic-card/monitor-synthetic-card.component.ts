import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-monitor-synthetic-card',
  templateUrl: './monitor-synthetic-card.component.html',
  styleUrls: ['./monitor-synthetic-card.component.scss']
})
export class MonitorSyntheticCardComponent {

  @Input('taf-description') description: string;
  @Input('taf-type') type: string;
  @Input('taf-quantity') quantity: number;
  @Input('taf-primary') primary: boolean;
  @Output() selected = new EventEmitter();

  onChildSelect(): void {
    this.selected.emit(this.type);
  }

}
