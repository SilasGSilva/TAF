import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PoPageModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { AuditChartModule } from './audit-chart/audit-chart.module';
import { AuditFilterModule } from './audit-filter/audit-filter.module';
import { AuditTableModule } from './audit-table/audit-table.module';
import { AuditProgressModule } from './audit-progress/audit-progress.module';
import { SocialAuditComponent } from './social-audit.component';

@NgModule({
  declarations: [SocialAuditComponent],
  imports: [
    BrowserModule,
    PoPageModule,
    CoreModule,
    AuditFilterModule,
    AuditTableModule,
    AuditProgressModule,
    AuditChartModule
  ]
})
export class SocialAuditModule { }
