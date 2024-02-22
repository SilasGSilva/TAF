import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoDisclaimerGroupModule,
  PoFieldModule,
  PoModalModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { LegacyStatusEnvironmentModalModule } from '../../../../shared/legacy-status-environment/legacy-status-environment-modal.module';
import { SharedModule } from '../../../../shared/shared.module';
import { InssReportFilterComponent } from './inss-report-filter.component';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [InssReportFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PoFieldModule,
    PoButtonModule,
    PoDisclaimerGroupModule,
    PoWidgetModule,
    PoModalModule,
    SharedModule,
    ReactiveFormsModule,
    LegacyStatusEnvironmentModalModule,
  ],
  exports: [InssReportFilterComponent],
})
export class InssReportFilterModule {}
