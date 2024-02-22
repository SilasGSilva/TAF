import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoChartModule, PoModalModule, PoTableModule, PoButtonModule, PoFieldModule } from '@po-ui/ng-components';
import { AuditService } from './../audit-filter/services/audit.service';
import { AuditTableModule } from './../audit-table/audit-table.module';
import { AuditChartComponent } from './audit-chart.component';

@NgModule({
  declarations: [AuditChartComponent],
  imports: [
    CommonModule,
    PoChartModule,
    PoModalModule,
    PoTableModule,
    PoButtonModule,
    PoFieldModule,
    AuditTableModule
  ],
  exports: [AuditChartComponent],
  providers: [AuditService]
})
export class AuditChartModule { }
