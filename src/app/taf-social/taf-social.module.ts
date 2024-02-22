import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';
import { Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { LaborProcessModule } from '../labor-process/labor-process.module';
import { FgtsModule } from './conference-reports/fgts/fgts.module';
import { ReportsDeactivateGuard } from './conference-reports/guards/reports-deactivate.guard';
import { InssModule } from './conference-reports/inss/inss.module';
import { EditorXMLModule } from './editor-xml/editor-xml.module';
import { RestrictionByEventActivateGuard } from './guards/restriction-by-event-activate.guard';
import { RequiredEventsService } from './services/required-events/required-events.service';
import { SocialListBranchService } from './services/social-list-branch/social-list-branch.service';
import { SocialListEventService } from './services/social-list-event/social-list-event.service';
import { SocialRestrictionListEventService } from './services/social-restriction-list-event/social-restriction-list-event.service';
import { SocialAuditModule } from './social-audit/social-audit.module';
import { TafSocialCatModule } from './social-cat/social-cat.module';
import { MonitorDetailModule } from './social-monitor/monitor-detail/monitor-detail.module';
import { SocialMonitorModule } from './social-monitor/social-monitor.module';
import { TafSocialComponent } from './taf-social.component';
import { TafSocialRountingModule } from './taf-social.routing.module';
import { IrrfModule } from './conference-reports/irrf/irrf.module';

registerLocaleData(localeBr);

@Injectable({ providedIn: 'root' })
@NgModule({
  declarations: [TafSocialComponent],
  imports: [
    InssModule,
    IrrfModule,
    FgtsModule,
    TafSocialRountingModule,
    SocialMonitorModule,
    MonitorDetailModule,
    EditorXMLModule,
    SocialAuditModule,
    TafSocialCatModule,
    LaborProcessModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    SocialListBranchService,
    SocialListEventService,
    SocialRestrictionListEventService,
    RequiredEventsService,
    ReportsDeactivateGuard,
    RestrictionByEventActivateGuard,
  ],
})
export class TafSocialModule {}
