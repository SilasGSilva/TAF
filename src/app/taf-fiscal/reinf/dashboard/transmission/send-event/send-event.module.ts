import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import {
  PoButtonModule,
  PoModalModule,
  PoLoadingModule,
  PoI18nPipe,
} from '@po-ui/ng-components';

import { SendEventComponent } from './send-event.component';
import { SendEventService } from './send-event.service';
import { MessengerModule } from 'shared/messenger/messenger.module';
import { DialogYesNoModule } from 'shared/dialog-yes-no/dialog-yes-no-module';

@NgModule({
  declarations: [SendEventComponent],
  imports: [
    CommonModule,
    BrowserModule,
    PoButtonModule,
    PoModalModule,
    PoLoadingModule,
    MessengerModule,
    DialogYesNoModule,
  ],

  exports: [SendEventComponent],
  providers: [SendEventService, PoI18nPipe],
})
export class SendEventModule {}
