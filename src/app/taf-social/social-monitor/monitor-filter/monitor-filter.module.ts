import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoWidgetModule, PoFieldModule, PoButtonModule, PoDisclaimerGroupModule, PoPopoverModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { MonitorFilterComponent } from './monitor-filter.component';

@Injectable({
  providedIn: 'root'
})
@NgModule({
  declarations: [
    MonitorFilterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    CoreModule,
    PoWidgetModule,
    PoFieldModule,
    PoButtonModule,
    PoWidgetModule,
    PoDisclaimerGroupModule,
    ReactiveFormsModule,
    PoPopoverModule
  ],
  exports: [
    MonitorFilterComponent
  ]

})
export class MonitorFilterModule { }
