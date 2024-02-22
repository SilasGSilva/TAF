import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'core/errors/page-not-found/page-not-found.component';
import { MonitorDetailComponent } from './monitor-detail/monitor-detail.component';
import { SocialMonitorComponent } from './social-monitor.component';

const tafSocialRoutes: Routes = [
  {
    path: 'socialMonitor',
    children: [
      {
        path: '',
        component: SocialMonitorComponent,
      },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
  { path: 'monitorDetail', component: MonitorDetailComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(tafSocialRoutes)],
  exports: [RouterModule],
})
export class SocialMonitorRoutingModule {}
