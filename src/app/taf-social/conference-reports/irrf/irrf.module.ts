import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoLoadingModule, PoPageModule, PoProgressModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { IrrfReportTableModule } from './irrf-report-table/irrf-report-table.module';
import { IrrfReportFilterModule } from './irrf-report-filter/irrf-report-filter.module';
import { IrrfReportCardSyntheticDashboardModule } from './irrf-report-card-synthetic-dashboard/irrf-report-card-synthetic-dashboard.module';
import { IrrfReportCardStoreService } from '../services/stores/irrf/irrf-report-card-store/irrf-report-card-store.service';
import { IrrfReportParamsStoreService } from '../services/stores/irrf/irrf-report-params-store/irrf-report-params-store.service';
import { IrrfReportRequestParamsStoreService } from '../services/stores/irrf/irrf-report-request-params-store/irrf-report-request-params-store.service';
import { IrrfReportStoreService } from '../services/stores/irrf/irrf-report-store/irrf-report-store.service';
import { IrrfComponent } from './irrf.component';

@NgModule({
  declarations: [IrrfComponent],
  imports: [
    CommonModule,
    CoreModule,
    PoPageModule,
    IrrfReportFilterModule,
    PoProgressModule,
    IrrfReportCardSyntheticDashboardModule,
    IrrfReportTableModule,
    PoLoadingModule
  ],
  providers: [
    IrrfReportCardStoreService,
    IrrfReportParamsStoreService,
    IrrfReportRequestParamsStoreService,
    IrrfReportStoreService
  ]
})
export class IrrfModule { }
