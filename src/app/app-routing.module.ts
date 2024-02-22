import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from 'auth/login/login.component';
import { TafFiscalComponent } from 'taf-fiscal/taf-fiscal.component';
import { DashboardComponent } from 'taf-fiscal/reinf/dashboard/dashboard.component';
import { LaborProcessListComponent } from './labor-process/pages/labor-process-list/labor-process-list.component';
import { environment } from '../environments/environment';

const routes: Routes = [
  {
    path: 'index.html',
    component: TafFiscalComponent,
    children: [{ path: '', component: DashboardComponent }],
  },
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'labor-process',
    component: LaborProcessListComponent,
  }, {
    path: 'lalurlacs',
    component: TafFiscalComponent,
  }

];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
