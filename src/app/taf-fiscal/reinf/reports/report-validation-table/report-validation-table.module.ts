import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../../shared/table/table.module';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { ReportValidationTableComponent } from './report-validation-table.component';

@NgModule({
  declarations: [ReportValidationTableComponent],
  imports: [CommonModule, TableModule],
  exports: [ReportValidationTableComponent],
  providers: [MasksPipe],
})
export class ReportValidationTableModule {}
