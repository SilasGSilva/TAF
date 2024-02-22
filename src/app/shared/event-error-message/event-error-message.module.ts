import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { PoPageModule, PoModalModule, PoLoadingModule } from '@po-ui/ng-components';

import { EventErrorMessageComponent } from './event-error-message.component';

@NgModule({
  declarations: [
    EventErrorMessageComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    PoPageModule,
    PoModalModule,
    PoLoadingModule
  ],
  exports: [
    EventErrorMessageComponent
  ]
})
export class EventErrorMessageModule { }
