import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticationGuard } from './@core/shared/guards/authentication.guard';

export const routes: Routes = [
  { path: 'onlinechecking', loadChildren: () => import('./online-checking/online-checking.module').then(m => m.OnlineCheckingModule) },
  { path: 'authentication', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: 'authorization', canActivate: [AuthenticationGuard], loadChildren: () => import('./authorization/authorization.module').then(m => m.AuthorizationModule) },
  { path: 'pages', canActivate: [AuthenticationGuard], loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'authentication' }
];

const config: ExtraOptions = {
  useHash: false,
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled'  
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
