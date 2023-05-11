import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

/*
  09 MAR 2023 wutthichair
*/
import { HomeModule } from './home/home.module';
import { PerformanceModule } from './performance/performance.module';
import { SepModule } from './sep/sep.module';
import { Ets1Module } from './ets1/ets1.module';
import { DocumentsAmendmentModule } from './documents-amendment/documents-amendment.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { PersonalDocumentsModule } from './personal-documents/personal-documents.module';
import { EVRModule } from './e-vr/e-vr.module';

@NgModule({
  imports: [
    AuthorizationModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    PersonalDocumentsModule,
    DocumentsAmendmentModule,
    
    /*
      09 MAR 2023 wutthichair
    */
    HomeModule,
    PerformanceModule,
    SepModule,
    Ets1Module,

    EVRModule,
    
    MiscellaneousModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
