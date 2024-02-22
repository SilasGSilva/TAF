import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoInfoModule, PoLoadingModule, PoModalModule, PoPageModule, PoPopupModule, PoToolbarModule, PoWidgetModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { SmartViewMonitorComponent } from './sv-monitor.component';
import { SmartViewHeaderComponent } from '../shared/header/sv-header.component';
import { SmartViewFilterComponent } from '../shared/filter/sv-filter.component';
import { SmartViewFilterService } from '../shared/filter/sv-filter.service';

@NgModule({
  declarations: [
    SmartViewMonitorComponent,
    SmartViewHeaderComponent,
    SmartViewFilterComponent,
  ],
  providers: [SmartViewFilterService],
  imports: [CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    PoFieldModule,
    PoPageModule,
    PoButtonModule,
    PoLoadingModule,
    PoModalModule,
    PoWidgetModule,    
    PoInfoModule,
    CoreModule,
    PoToolbarModule,
    PoPopupModule],
})
export class SmartViewMonitorModule { }