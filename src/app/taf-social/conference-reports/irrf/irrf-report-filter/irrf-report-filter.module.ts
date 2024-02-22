import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoButtonModule, PoDisclaimerGroupModule, PoFieldModule, PoModalModule, PoWidgetModule } from '@po-ui/ng-components';
import { LegacyStatusEnvironmentModalModule } from 'shared/legacy-status-environment/legacy-status-environment-modal.module';
import { SharedModule } from 'shared/shared.module';
import { IrrfReportFilterService } from './services/irrf-report-filter.service';
import { IrrfReportFilterComponent } from './irrf-report-filter.component';

@NgModule({
  declarations: [IrrfReportFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PoWidgetModule,
    PoFieldModule,
    PoButtonModule,
    PoModalModule,
    SharedModule,
    PoDisclaimerGroupModule,
    LegacyStatusEnvironmentModalModule
  ],
  exports: [
    IrrfReportFilterComponent
  ],
  providers: [
    IrrfReportFilterService
  ]
})
export class IrrfReportFilterModule { }
