import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransmissionPendingTableDetailComponent } from './transmission-pending-table-detail.component';
import { TableDetailsModule } from 'shared/table/table-details/table-details.module';

@NgModule({
  declarations: [TransmissionPendingTableDetailComponent],
  imports: [
    CommonModule,
    TableDetailsModule
  ],
  exports: [
    TransmissionPendingTableDetailComponent
  ]
})
export class TransmissionPendingTableDetailModule { }
