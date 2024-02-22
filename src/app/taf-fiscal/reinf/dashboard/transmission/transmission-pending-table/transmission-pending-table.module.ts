import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoContainerModule, PoFieldModule, PoDisclaimerGroupModule } from '@po-ui/ng-components';

import { TransmissionPendingTableComponent } from './transmission-pending-table.component';
import { TableModule } from 'shared/table/table.module';

@NgModule({
    declarations: [
        TransmissionPendingTableComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        PoContainerModule,
        PoFieldModule,
        PoDisclaimerGroupModule,
        TableModule
    ],
    exports: [
        TransmissionPendingTableComponent
    ]
})
export class TransmissionPendingTableModule { }
