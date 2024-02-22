import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  PoButtonModule,
  PoContainerModule,
  PoDividerModule,
  PoFieldModule,
  PoInfoModule,
  PoListViewModule,
  PoModalModule,
  PoPopupModule,
  PoTableModule,
  PoTagModule,
  PoWidgetModule,
  PoDropdownModule
} from '@po-ui/ng-components';
import { MessengerModule } from 'shared/messenger/messenger.module';
import { PipeModule } from 'shared/pipe/pipe.module';
import { FaqModalModule } from 'shared/faq-modal/faq-modal.module';
import { InssReportCardModule } from '../inss-report-card/inss-report-card.module';
import { InssReportTableComponent } from './inss-report-table.component';

@NgModule({
  declarations: [InssReportTableComponent],
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
    InssReportCardModule,
    PoTagModule,
    PoPopupModule,
    PoContainerModule,
    PoDropdownModule,
    FaqModalModule,
    PipeModule
  ],
  exports: [InssReportTableComponent],
})
export class InssReportTableModule { }
