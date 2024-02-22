import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RestrictionByEventActivateGuard } from './guards/restriction-by-event-activate.guard';
import { ReportsDeactivateGuard } from './conference-reports/guards/reports-deactivate.guard';
import { PageNotFoundComponent } from 'core/errors/page-not-found/page-not-found.component';
import { SocialAuditComponent } from './social-audit/social-audit.component';
import { FgtsComponent } from './conference-reports/fgts/fgts.component';
import { InssComponent } from './conference-reports/inss/inss.component';
import { SocialCatComponent } from './social-cat/social-cat.component';
import { IrrfComponent } from './conference-reports/irrf/irrf.component';

const tafSocialRoutes: Routes = [
  {
    path: 'inssReport',
    children: [
      {
        path: '',
        component: InssComponent,
        canActivate: [RestrictionByEventActivateGuard],
        canDeactivate: [ReportsDeactivateGuard],
      },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
  {
    path: 'irrfReport',
    children: [
      {
        path: '',
        component: IrrfComponent,
        canActivate: [RestrictionByEventActivateGuard],
        canDeactivate: [ReportsDeactivateGuard],
      },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
  {
    path: 'fgtsReport',
    children: [
      {
        path: '',
        component: FgtsComponent,
        canActivate: [RestrictionByEventActivateGuard],
        canDeactivate: [ReportsDeactivateGuard],
      },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
  {
    path: 'socialAudit',
    children: [
      { path: '', component: SocialAuditComponent},
      { path: '**', component: PageNotFoundComponent }
    ]
  },
  {
    path: 'socialCat',
    children: [
      { path: '', component: SocialCatComponent,
       canActivate: [RestrictionByEventActivateGuard],
      },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(tafSocialRoutes)],
  exports: [RouterModule],
})
export class TafSocialRountingModule {}
