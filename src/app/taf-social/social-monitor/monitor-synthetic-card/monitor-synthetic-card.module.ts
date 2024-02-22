import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { PoWidgetModule } from '@po-ui/ng-components';

import { CoreModule } from 'core/core.module';
import { MonitorSyntheticCardComponent } from './monitor-synthetic-card.component';

@Injectable({
  providedIn: 'root'
})
@NgModule({
  declarations: [
    MonitorSyntheticCardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    CoreModule,
    PoWidgetModule
  ],
  exports: [
    MonitorSyntheticCardComponent
  ]

})
export class MonitorSyntheticCardModule { }
