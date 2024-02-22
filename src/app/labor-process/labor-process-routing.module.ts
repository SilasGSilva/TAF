import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LaborProcessComponent } from './labor-process.component';
import { LaborProcessListComponent } from './pages/labor-process-list/labor-process-list.component';
import { LaborProcessDetailComponent } from './pages/labor-process-detail/labor-process-detail.component';
import { PageNotFoundComponent } from '../core/errors/page-not-found/page-not-found.component';
import { LaborProcessTaxListComponent } from './pages/labor-process-tax-list/labor-process-tax-list.component';
import { LaborProcessTaxDetailComponent } from './pages/labor-process-tax-detail/labor-process-tax-detail.component';
const routes: Routes = [
  {
    path: 'labor-process',
    component: LaborProcessComponent,
    children: [
      {
        path: '',
        component: LaborProcessListComponent,
      },
      {
        path: 'tax',
        component: LaborProcessTaxListComponent,
      },
      {
        path: 'tax/detail',
        component: LaborProcessTaxDetailComponent,
      },
      {
        path: 'tax/detail/:id',
        component: LaborProcessTaxDetailComponent,
      },
      {
        path: 'detail',
        component: LaborProcessDetailComponent,
      },
      {
        path: 'detail/:id',
        component: LaborProcessDetailComponent,
      },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaborProcessRoutingModule { }
