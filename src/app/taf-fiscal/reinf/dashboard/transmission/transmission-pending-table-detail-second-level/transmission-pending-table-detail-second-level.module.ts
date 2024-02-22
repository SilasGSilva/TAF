import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableDetailsSecondLevelModule } from 'shared/table/table-details-second-level/table-details-second-level.module';
import { TransmissionPendingTableDetailSecondLevelComponent } from './transmission-pending-table-detail-second-level.component';

@NgModule({
  declarations: [TransmissionPendingTableDetailSecondLevelComponent],
  imports: [
    CommonModule,
    TableDetailsSecondLevelModule
  ],
  exports: [
    TransmissionPendingTableDetailSecondLevelComponent
  ]
})
export class TransmissionPendingTableDetailSecondLevelModule { }
