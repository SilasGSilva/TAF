import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IrrfReportCardModule } from './irrf-report-card/irrf-report-card.module';
import { IrrfReportCardSyntheticDashboardComponent } from './irrf-report-card-synthetic-dashboard.component';

@NgModule({
  declarations: [
    IrrfReportCardSyntheticDashboardComponent
  ],
  imports: [
    CommonModule,
    IrrfReportCardModule
  ],
  exports: [IrrfReportCardSyntheticDashboardComponent]
})
export class IrrfReportCardSyntheticDashboardModule { }
