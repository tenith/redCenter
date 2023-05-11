import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { PerformanceComponent } from './performance/performance.component';
import { SepComponent } from './sep/sep.component';
import { PagesGuard } from '../@core/shared/guards/pages.guard';
import { AuthorizationComponent } from './authorization/authorization.component';
import { PersonalDocumentsComponent } from './personal-documents/personal-documents.component';
import { ForbiddenComponent } from './miscellaneous/forbidden/forbidden.component';
import { EVRComponent } from './e-vr/e-vr.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    { path: 'home', component: HomeComponent, },
    { path: 'authorization', canActivate: [PagesGuard], component: AuthorizationComponent, },
    // { path: 'documents_amendment', canActivate: [PagesGuard], component: DocumentsAmendmentComponent, },
    { path: 'documents_amendment', loadChildren: () => import('../pages/documents-amendment/documents-amendment.module').then(m => m.DocumentsAmendmentModule), },

    { path: 'personal_documents', canActivate: [PagesGuard], component: PersonalDocumentsComponent, },
    { path: 'eVR', loadChildren: () => import('../pages/e-vr/e-vr.module').then(m => m.EVRModule), },
    { path: 'performance', canActivate: [PagesGuard], component: PerformanceComponent, },
    { path: 'ets1', loadChildren: () => import('../pages/ets1/ets1.module').then(m => m.Ets1Module), },

    { path: 'sep', canActivate: [PagesGuard], component: SepComponent, },

    { path: 'forbidden', component: ForbiddenComponent, },
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
