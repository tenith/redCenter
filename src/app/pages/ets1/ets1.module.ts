import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ets1RoutingModule } from './ets1-routing.module';
import { Ets1Component } from './ets1.component';
import { IworkspaceComponent } from './iworkspace/iworkspace.component';
import { TworkspaceComponent } from './tworkspace/tworkspace.component';


@NgModule({
  declarations: [
    Ets1Component,
    IworkspaceComponent,
    TworkspaceComponent
  ],
  imports: [
    CommonModule,
    Ets1RoutingModule
  ]
})
export class Ets1Module { }
