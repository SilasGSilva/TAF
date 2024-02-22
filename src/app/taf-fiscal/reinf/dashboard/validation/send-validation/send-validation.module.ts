import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import {
  PoButtonModule,
  PoLoadingModule,
  PoModalModule,
  PoI18nPipe,
  PoFieldModule,
  PoNotificationModule,
} from '@po-ui/ng-components';

import { SendValidationComponent } from './send-validation.component';
import { MessengerModule } from 'shared/messenger/messenger.module';

@NgModule({
  declarations: [SendValidationComponent],
  imports: [
    CommonModule,
    BrowserModule,
    PoButtonModule,
    PoModalModule,
    PoLoadingModule,
    PoNotificationModule,
    MessengerModule,
    PoFieldModule,
    FormsModule
  ],
  exports: [
    SendValidationComponent
  ],
  providers: [
    PoI18nPipe
  ]
})
export class SendValidationModule { }
