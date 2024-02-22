import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoAccordionModule, PoButtonModule, PoInfoModule, PoModalModule, PoPopupModule, PoTableModule, PoTagModule } from '@po-ui/ng-components';
import { FaqModalModule } from 'shared/faq-modal/faq-modal.module';
import { IrrfReportTableModalComponent } from './irrf-report-table-modal.component';

@NgModule({
  declarations: [IrrfReportTableModalComponent],
  imports: [
    CommonModule,
    PoInfoModule,
    PoModalModule,
    PoTableModule,
    PoButtonModule,
    PoAccordionModule,
    PoPopupModule,
    PoTagModule,
    FaqModalModule
  ],
  exports: [IrrfReportTableModalComponent]
})
export class IrrfReportTableModalModule { }