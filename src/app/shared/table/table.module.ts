import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import {
  PoTableModule,
  PoLoadingModule,
  PoContainerModule,
} from '@po-ui/ng-components';

import { TableComponent } from './table.component';
import { TableDetailsModule } from './table-details/table-details.module';
import { ValidationPendingTableDetailModule } from 'taf-fiscal/reinf/dashboard/validation/validation-pending-table-detail/validation-pending-table-detail.module';
import { TransmissionPendingTableDetailModule } from 'taf-fiscal/reinf/dashboard/transmission/transmission-pending-table-detail/transmission-pending-table-detail.module';
import { ReportValidationTableDetailModule } from 'taf-fiscal/reinf/reports/report-validation-table-detail/report-validation-table-detail.module';

@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    BrowserModule,
    PoTableModule,
    PoContainerModule,
    PoLoadingModule,
    TableDetailsModule,
    ValidationPendingTableDetailModule,
    TransmissionPendingTableDetailModule,
    ReportValidationTableDetailModule,
  ],
  exports: [TableComponent],
})
export class TableModule {}
