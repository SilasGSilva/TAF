import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoFieldModule, PoTableModule, PoModalModule, PoListViewModule, PoInfoModule, PoWidgetModule, PoDividerModule, PoButtonModule } from '@po-ui/ng-components';
import { PipeModule } from 'shared/pipe/pipe.module';
import { MessengerModule } from 'shared/messenger/messenger.module';
import { FgtsReportTableComponent } from './fgts-report-table.component';

@NgModule({
  declarations: [FgtsReportTableComponent],
  imports: [
    CommonModule,
    PoFieldModule,
    PoTableModule,
    PoModalModule,
    PoListViewModule,
    PoInfoModule,
    PoWidgetModule,
    PoDividerModule,
    PoButtonModule,
    MessengerModule,
    PipeModule
  ],
  exports: [FgtsReportTableComponent],
})
export class FgtsReportTableModule {}
