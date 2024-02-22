import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PoBreadcrumbItem, PoNotificationService } from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';
import { TransmissionPendingTableComponent } from './transmission-pending-table/transmission-pending-table.component';
import { SendEventComponent } from './send-event/send-event.component';
import { EventDescriptionService } from 'shared/event-description/event-description.service';
import { EventDescription } from '../../../../models/event-description';

@Component({
  selector: 'app-transmission',
  templateUrl: './transmission.component.html',
  styleUrls: ['./transmission.component.scss'],
})
export class TransmissionComponent implements OnInit {
  public statusEnvironment: string;
  public stepperItems: Array<PoBreadcrumbItem>;
  public literals = {};
  public path = 'transmission';
  public params = this.activatedRoute.snapshot.queryParams;
  public selectedEntry: Array<any>;
  public sent = false;

  @ViewChild(TransmissionPendingTableComponent)
  transmissionPendingTableComponent: TransmissionPendingTableComponent;
  @ViewChild(SendEventComponent)
  sendEventComponent: SendEventComponent;

  @Input('taf-description') description: string;

  constructor(
    private literalsService: LiteralService,
    private activatedRoute: ActivatedRoute,
    private eventDescriptionService: EventDescriptionService,
    private poNotificationService: PoNotificationService,
  ) {
    this.literals = this.literalsService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.stepperItems = [
      { label: this.literals['transmission']['eventsMonitor'] },
      {
        label: this.literals['transmission']['transmission'],
      },
    ];

    this.getDescription({ eventDesc: this.params.event });
  }

  public getDescription(eventDescription: EventDescription): void {
    this.eventDescriptionService
      .getDescription(eventDescription)
      .subscribe(res => (this.description = res.description));
  }

  public transmissionSent(): void {
    this.transmissionPendingTableComponent.reloadData();
    this.toggleButton(true);
  }

  public toggleButton(disable: boolean): void {
    if ( this.sendEventComponent != null && this.sendEventComponent != undefined ) {
      if ( this.sendEventComponent.isR2055RCP ) {
        this.toggleButtonTransAll()
      } else {
        disable
        ? this.sendEventComponent.disableButton()
        : this.sendEventComponent.enableButton();
      }
    }
  }

  public toggleButtonTransAll(): void {
    if ( this.transmissionPendingTableComponent.eventDetail != null ) {
      if (this.transmissionPendingTableComponent.itemChecked ) {
        this.sendEventComponent.labelbtn = this.literals['sendEvent']['toTransmitChecked'];
        this.sendEventComponent.transmitAll = false;
      } else {
        this.sendEventComponent.labelbtn = this.literals['sendEvent']['toTransmitAll'];
        this.sendEventComponent.transmitAll = true;
      }

      if(this.transmissionPendingTableComponent.eventDetail[0].status === 'notTransmitted'){
        this.sendEventComponent.enableButton();
      }else{
        this.sendEventComponent.disableButton()
      }
    }
  }
}
