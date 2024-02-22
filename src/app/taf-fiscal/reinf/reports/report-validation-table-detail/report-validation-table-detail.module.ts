import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoNotificationModule } from '@po-ui/ng-components';

import { ReportValidationTableDetailComponent } from './report-validation-table-detail.component';
import { TableDetailsModule } from 'shared/table/table-details/table-details.module';
import { MasksPipe } from 'shared/pipe/masks.pipe';

@NgModule({
  declarations: [ReportValidationTableDetailComponent],
  imports: [CommonModule, TableDetailsModule, PoNotificationModule],
  exports: [ReportValidationTableDetailComponent],
  providers: [MasksPipe],
})
export class ReportValidationTableDetailModule { }
