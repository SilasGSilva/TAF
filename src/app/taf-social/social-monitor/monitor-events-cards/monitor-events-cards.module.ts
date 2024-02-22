import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { PoWidgetModule, PoFieldModule } from '@po-ui/ng-components';

import { CoreModule } from 'core/core.module';
import { MonitorEventsCardsComponent } from './monitor-events-cards.component';

@Injectable({
  providedIn: 'root'
})
@NgModule({
  declarations: [
    MonitorEventsCardsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    CoreModule,
    PoWidgetModule,
    PoFieldModule,
  ],
  exports: [
    MonitorEventsCardsComponent
  ]

})

export class MonitorEventsCardsModule { }
