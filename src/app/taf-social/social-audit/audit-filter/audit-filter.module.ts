import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoDisclaimerGroupModule,
  PoFieldModule,
  PoPopoverModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { SocialListBranchService } from '../../services/social-list-branch/social-list-branch.service';
import { SocialListEventService } from './../../services/social-list-event/social-list-event.service';
import { AuditFilterComponent } from './audit-filter.component';
import { AuditEnvironmentService } from './services/audit-environment.service';
import { AuditService } from './services/audit.service';

@NgModule({
  declarations: [AuditFilterComponent],
  imports: [
    CommonModule,
    PoWidgetModule,
    PoFieldModule,
    PoButtonModule,
    PoDisclaimerGroupModule,
    FormsModule,
    ReactiveFormsModule,
    PoPopoverModule,
  ],
  exports: [AuditFilterComponent],
  providers: [
    AuditService,
    AuditEnvironmentService,
    SocialListBranchService,
    SocialListEventService,
  ],
})
export class AuditFilterModule {}
