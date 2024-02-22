import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { PoContainerModule } from '@po-ui/ng-components';

import { CoreModule } from 'core/core.module';
import { EventStatusCardComponent } from './event-status-cards.component';

@NgModule({
  declarations: [EventStatusCardComponent],
  imports: [
    BrowserModule,
    CommonModule,
    PoContainerModule,
    CoreModule
  ],
  exports: [
    EventStatusCardComponent
  ]

})
export class EventStatusCardModule { }
