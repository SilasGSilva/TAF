import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PoBreadcrumbItem, PoNotificationService } from '@po-ui/ng-components';

import { LiteralService } from 'literals';
import { SendValidationComponent } from './send-validation/send-validation.component';
import { EventDescriptionService } from 'shared/event-description/event-description.service';
import { ValidationPendingTableComponent } from './validation-pending-table/validation-pending-table.component';
import { EventDescription } from '../../../../models/event-description';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
})
export class ValidationComponent implements OnInit {
  public literals: object;
  public reset: string;

  public eventTitle: string;
  public path = 'validation';
  public tableLoad = false;
  public isDisabled = true;
  public validationSuccess = false;
  public params = this.activatedRoute.snapshot.queryParams;
  public validationErrors = [];
  public stepperItems: Array<PoBreadcrumbItem>;

  @Input('taf-description') description: string;

  @ViewChild(SendValidationComponent, { static: true })
  sendValidationComponent: SendValidationComponent;
  @ViewChild(ValidationPendingTableComponent, { static: true })
  validationPendingTableComponent: ValidationPendingTableComponent;

  constructor(
    private literalsService: LiteralService,
    private activatedRoute: ActivatedRoute,
    private eventDescriptionService: EventDescriptionService,
    private poNotificationService: PoNotificationService,
  ) {
    this.literals = this.literalsService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.eventTitle = this.handleTitle();
    this.stepperItems = this.handleStepper();

    this.getDescription({ eventDesc: this.params.event });
  }

  public getDescription(eventDescription: EventDescription): void {
    this.eventDescriptionService
      .getDescription(eventDescription)
      .subscribe(res => (this.description = res.description));
  }

  public toggleButton(disable: boolean): void {
    disable
      ? this.sendValidationComponent.disableButton()
      : this.sendValidationComponent.enableButton();
  }

  public selectedEntry(selectedEntry): void {
    this.sendValidationComponent.setSelectedEntry(selectedEntry);
  }

  public validation(): void {
    this.validationPendingTableComponent.reload();
    if (!this.validationPendingTableComponent.validationAll) {
      this.toggleButton(true);
    } else {
      this.toggleButtonLabel(false);
      this.toggleButton(false);
    };
  }

  public handleTitle() {
    if (this.params.event === 'R-1000') {
      return this.literals['validation']['titleRegister'];
    } else {
      return this.literals['validation']['titleInvoice'];
    }
  }

  public handleStepper() {
    return [
      { label: this.literals['validation']['eventsMonitor'] },
      { label: this.literals['validation']['validationPending'] },
    ];
  }

  public async validationError(message = []): Promise<void> {
    this.validationErrors.push(...message);
    await this.writeErrorToSessionStorage();
    this.validationPendingTableComponent.reload();
    this.toggleButton(true);
  }

  public async writeErrorToSessionStorage(): Promise<void> {
    sessionStorage.setItem(
      'TAFLogValidation',
      JSON.stringify(this.validationErrors)
    );
  }

  public toggleButtonLabel(markedItens: boolean): void {
      this.sendValidationComponent.labelToMarkedItens(markedItens);
  }
}
