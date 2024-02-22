import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoWidgetModule } from '@po-ui/ng-components';
import { IrrfReportCardComponent } from './irrf-report-card.component';

@NgModule({
  declarations: [IrrfReportCardComponent],
  imports: [
    CommonModule,
    PoWidgetModule
  ],
  exports: [IrrfReportCardComponent]
})
export class IrrfReportCardModule { }
