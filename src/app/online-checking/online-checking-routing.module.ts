import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemoteSEPComponent } from './remote-sep/remote-sep.component';

const routes: Routes = [{
  path: '',
  component: RemoteSEPComponent,  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineCheckingRoutingModule { }
