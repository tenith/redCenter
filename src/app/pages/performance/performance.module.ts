import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceComponent } from './performance.component';

import { NbIconModule } from '@nebular/theme';
import { NbCardModule } from '@nebular/theme';
import { NbAccordionModule } from '@nebular/theme';
import { NbTreeGridModule } from '@nebular/theme';



@NgModule({
  declarations: [
    PerformanceComponent
  ],
  imports: [
    CommonModule,
    NbIconModule,
    NbCardModule,
    NbAccordionModule,
    NbTreeGridModule
  ]
})
export class PerformanceModule { }
