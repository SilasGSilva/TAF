import { Component, ViewChild } from '@angular/core';
import { PoModalComponent } from '@po-ui/ng-components';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
})
export class MessengerComponent {
  public title: string;
  public description: string;
  public hasClickOut: boolean;
  public hideClose: boolean;

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  public onShowMessage(
    description: string,
    hasClickOut: boolean,
    hideClose: boolean,
    title?: string
  ): void {
    this.description = description;
    this.hideClose = hideClose;
    this.hasClickOut = hasClickOut;
    this.title = title;
    this.poModal.open();
  }
}
