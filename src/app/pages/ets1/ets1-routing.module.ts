import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../miscellaneous/not-found/not-found.component';
import { Ets1Component } from './ets1.component';
import { IworkspaceComponent } from './iworkspace/iworkspace.component';
import { TworkspaceComponent } from './tworkspace/tworkspace.component';

const routes: Routes = [{
  path: '',
  component: Ets1Component,
  children: [
    { path: 'iworkspace', component: IworkspaceComponent},
    { path: 'tworkspace', component: TworkspaceComponent},
    { path: '', redirectTo: 'tworkspace', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ets1RoutingModule { }
