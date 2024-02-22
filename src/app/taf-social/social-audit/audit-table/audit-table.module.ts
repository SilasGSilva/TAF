import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoButtonModule, PoFieldModule, PoTableModule, PoModalModule, PoInfoModule, PoTagModule, PoPopoverModule } from '@po-ui/ng-components';
import { PipeModule } from 'shared/pipe/pipe.module';
import { AuditTableComponent } from './audit-table.component';
import { ExportExcelAuditService } from './services/export-excel-audit.service';

@NgModule({
  declarations: [AuditTableComponent],
  imports: [
    CommonModule,
    PoFieldModule,
    PoTableModule,
    PoButtonModule,
    PoModalModule,
    PoInfoModule,
    PoTagModule,
    PoPopoverModule,
    PipeModule
  ],
  exports: [AuditTableComponent],
  providers: [ExportExcelAuditService]
})
export class AuditTableModule { }
