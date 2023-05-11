import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EVRComponent } from './e-vr.component';
import { NotFoundComponent } from '../miscellaneous/not-found/not-found.component';

import { DashboardComponent } from '../e-vr/dashboard/dashboard.component';
import { WorkspaceComponent } from '../e-vr/workspace/workspace.component';
import { ModeratorGuard } from '../../@core/shared/guards/moderator.guard';

const routes: Routes = [{
  path: '',
  component: EVRComponent,
  children: [
    { path: 'dashboard', canActivate: [ModeratorGuard], component: DashboardComponent},
    { path: 'workspace', component: WorkspaceComponent},
    { path: '', redirectTo: 'workspace', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
  ],
}];

@NgModule({
  declarations: [
    EVRComponent,
    DashboardComponent,
    WorkspaceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class EVRModule { }
