import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SepComponent } from './sep.component';

import { NbCardModule } from '@nebular/theme';
import { NbIconModule } from '@nebular/theme';
import { NbSpinnerModule } from '@nebular/theme';

import { OneSepCardComponent } from './one-sep-card/one-sep-card.component';


@NgModule({
  declarations: [
    SepComponent,
    OneSepCardComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbSpinnerModule
  ]
})
export class SepModule { }
