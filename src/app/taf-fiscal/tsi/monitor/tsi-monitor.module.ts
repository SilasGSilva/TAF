
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoInfoModule, PoLoadingModule, PoModalModule, PoPageModule, PoPopupModule, PoTableModule, PoToolbarModule, PoWidgetModule, PoTooltipModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { SharedModule } from 'shared/shared.module';
import { DialogYesNoModule } from 'shared/dialog-yes-no/dialog-yes-no-module';
import { MessengerModule } from 'shared/messenger/messenger.module';
import { TsiExportReportComponent } from './export-report/tsi-export-report.component';
import { TsiMonitorComponent } from './tsi-monitor.component';
import { TsiFilterComponent } from '../shared/filter/tsi-filter.component';
import { TsiFilterService } from '../shared/filter/tsi-filter.service';
import { TsiTableComponent } from './table/tsi-table.component';
import { TsiTableService } from './table/tsi-table.service';
import { TsiStatusComponent } from '../shared/header/status/tsi-status.component';
import { TsiStatusService } from '../shared/header/status/tsi-status.service';
import { TsiHeaderComponent } from '../shared/header/tsi-header.component';
import { TsiLastStampComponent } from '../shared/filter/last-stamp/tsi-last-stamp.component';

@NgModule({
  exports: [TsiMonitorComponent, TsiHeaderComponent, TsiFilterComponent,  TsiStatusComponent, TsiTableComponent,TsiExportReportComponent],
  providers: [TsiFilterService,TsiTableService,TsiStatusService],
  declarations: [
    TsiMonitorComponent,
    TsiHeaderComponent,
    TsiFilterComponent,
    TsiStatusComponent,
    TsiTableComponent,
    TsiExportReportComponent,
    TsiLastStampComponent],
  imports: [CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    PoFieldModule,
    PoPageModule,
    PoButtonModule,
    PoLoadingModule,
    PoModalModule,
    PoWidgetModule,
    PoTableModule,
    MessengerModule,
    PoInfoModule,
    SharedModule,
    CoreModule,
    PoToolbarModule,
    PoPopupModule,
    PoTooltipModule,
    DialogYesNoModule],
})
export class TsiMonitorModule { }
