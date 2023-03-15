import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';

import { NbCardModule } from '@nebular/theme';
import { NbIconModule } from '@nebular/theme';
import { NbAccordionModule } from '@nebular/theme';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbAccordionModule
  ]
})
export class HomeModule { }
