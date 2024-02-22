import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoProgressModule } from '@po-ui/ng-components';
import { AuditProgressComponent } from './audit-progress.component';

@NgModule({
  declarations: [AuditProgressComponent],
  imports: [CommonModule, PoProgressModule ],
  exports: [AuditProgressComponent]
})
export class AuditProgressModule { }
