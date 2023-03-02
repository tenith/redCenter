import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { PerformanceComponent } from './performance/performance.component';
import { SepComponent } from './sep/sep.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    { path: 'home', component: HomeComponent, },
    { path: 'performance', component: PerformanceComponent, },
    { path: 'sep', component: SepComponent, },
    { path: 'ets1', loadChildren: () => import('../pages/ets1/ets1.module').then(m => m.Ets1Module), },
    { path: '', redirectTo: 'home', pathMatch: 'full', },
    { path: '**', component: NotFoundComponent, },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
