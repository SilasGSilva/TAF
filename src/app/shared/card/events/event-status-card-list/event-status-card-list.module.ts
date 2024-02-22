import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from 'core/core.module';
import { EventStatusCardListComponent } from './event-status-card-list.component';
import { EventStatusCardModule } from './event-status-card/event-status-card.module';

@NgModule({
  declarations: [EventStatusCardListComponent],
  imports: [
    BrowserModule,
    CommonModule,
    CoreModule,
    EventStatusCardModule
  ],
  exports: [EventStatusCardListComponent]
})
export class EventStatusCardListModule { }
