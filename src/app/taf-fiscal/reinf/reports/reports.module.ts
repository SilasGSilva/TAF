import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { PoPageModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { ReportFilterModule } from 'shared/filter/report-filter/report-filter.module';
import { ReportsComponent } from './reports.component';
import { ExportReportModule } from './export-report/export-report.module';
import { ReportValidationTableModule } from './report-validation-table/report-validation-table.module';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    BrowserModule,
    PoPageModule,
    CoreModule,
    ReportFilterModule,
    ExportReportModule,
    ReportValidationTableModule,
  ],
})
export class ReportsModule {}
