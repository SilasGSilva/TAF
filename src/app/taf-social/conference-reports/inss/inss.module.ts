import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PoLoadingModule, PoPageModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { InssReportCardModule } from './inss-report-card/inss-report-card.module';
import { InssReportFilterModule } from './inss-report-filter/inss-report-filter.module';
import { InssReportProgressModule } from './inss-report-progress/inss-report-progress.module';
import { InssReportTableModule } from './inss-report-table/inss-report-table.module';
import { InssComponent } from './inss.component';
import { InssReportCardStoreService } from '../services/stores/inss/inss-report-card-store/inss-report-card-store.service';
import { InssReportParamsStoreService } from '../services/stores/inss/inss-report-params-store/inss-report-params-store.service';
import { InssReportRequestParamsStoreService } from '../services/stores/inss/inss-report-request-params-store/inss-report-request-params-store.service';
import { InssReportStoreService } from '../services/stores/inss/inss-report-store/inss-report-store.service';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [InssComponent],
  imports: [
    BrowserModule,
    InssReportCardModule,
    InssReportFilterModule,
    InssReportTableModule,
    InssReportProgressModule,
    PoPageModule,
    PoLoadingModule,
    CoreModule,
  ],
  exports: [InssComponent],
  providers: [
    InssReportCardStoreService,
    InssReportParamsStoreService,
    InssReportRequestParamsStoreService,
    InssReportStoreService
  ]
})
export class InssModule { }
