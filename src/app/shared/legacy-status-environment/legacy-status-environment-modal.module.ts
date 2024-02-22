import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  PoInfoModule,
  PoModalModule,
  PoTagModule,
  PoWidgetModule,
  PoPopoverModule,
} from '@po-ui/ng-components';
import { LegacyStatusEnvironmentModalComponent } from './legacy-status-environment-modal.component';

@NgModule({
  declarations: [LegacyStatusEnvironmentModalComponent],
  imports: [
    CommonModule,
    PoModalModule,
    PoInfoModule,
    PoTagModule,
    PoWidgetModule,
    PoPopoverModule,
  ],
  exports: [LegacyStatusEnvironmentModalComponent],
})
export class LegacyStatusEnvironmentModalModule {}
