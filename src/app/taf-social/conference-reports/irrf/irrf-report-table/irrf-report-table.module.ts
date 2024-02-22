import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoDropdownModule, PoFieldModule, PoPopupModule, PoTableModule } from '@po-ui/ng-components';
import { FaqModalModule } from '../../../../shared/faq-modal/faq-modal.module';
import { PipeModule } from 'shared/pipe/pipe.module';
import { IrrfReportTableModalModule } from './irrf-report-table-modal/irrf-report-table-modal.module';
import { IrrfReportTableComponent } from './irrf-report-table.component';

@NgModule({
  declarations: [IrrfReportTableComponent],
  imports: [
    CommonModule,
    PoDropdownModule,
    PoFieldModule,
    PoTableModule,
    PoPopupModule,
    FaqModalModule,
    PipeModule,
    IrrfReportTableModalModule
  ],
  exports: [IrrfReportTableComponent]
})
export class IrrfReportTableModule { }
