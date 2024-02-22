import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { PoButtonModule, PoInfoModule, PoTagModule } from '@po-ui/ng-components';
import { ClosingEventComponent } from './closing-event.component';
import { EventErrorMessageModule } from 'shared/event-error-message/event-error-message.module';
import { MessengerModule } from 'shared/messenger/messenger.module';
import { DialogYesNoModule } from 'shared/dialog-yes-no/dialog-yes-no-module';
import { RemoveCompanyComponent } from '../remove-company/remove-company.component';

@NgModule({
  declarations: [ClosingEventComponent,RemoveCompanyComponent],
  imports: [
    CommonModule,
    BrowserModule,
    PoButtonModule,
    PoInfoModule,
    PoTagModule,
    EventErrorMessageModule,
    MessengerModule,
    DialogYesNoModule,
  ],
  exports: [ClosingEventComponent,RemoveCompanyComponent],
})
export class ClosingEventModule {}
