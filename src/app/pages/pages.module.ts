import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

/*
  09 MAR 2023 wutthichair
*/
import { HomeModule } from './home/home.module';
import { PerformanceModule } from './performance/performance.module';
import { SepModule } from './sep/sep.module';
import { Ets1Module } from './ets1/ets1.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    /*
      09 MAR 2023 wutthichair
    */
    HomeModule,
    PerformanceModule,
    SepModule,
    Ets1Module,
    
    MiscellaneousModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
