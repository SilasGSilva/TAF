import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { PoPageModule, PoTableModule, PoContainerModule, PoModalModule } from '@po-ui/ng-components';

import { EventMonitorTableComponent } from './event-monitor-table.component';
import { EventErrorMessageModule } from 'shared/event-error-message/event-error-message.module';
import { TableModule } from 'shared/table/table.module';

@Injectable({
  providedIn: 'root'
})
@NgModule({
  declarations: [
    EventMonitorTableComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    PoPageModule,
    PoTableModule,
    PoModalModule,
    PoContainerModule,
    EventErrorMessageModule,
    TableModule
  ],
  exports: [
    EventMonitorTableComponent
  ]
})
export class EventMonitorTableModule { }
