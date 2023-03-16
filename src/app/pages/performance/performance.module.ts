import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceComponent } from './performance.component';

import { NbIconModule } from '@nebular/theme';
import { NbCardModule } from '@nebular/theme';
import { NbAccordionModule } from '@nebular/theme';
import { NbTreeGridModule } from '@nebular/theme';

import { NgxEchartsModule } from 'ngx-echarts';
import { BasicChartComponent } from './basic-chart/basic-chart.component';


@NgModule({
  declarations: [
    PerformanceComponent,
    BasicChartComponent
  ],
  imports: [
    CommonModule,
    NbIconModule,
    NbCardModule,
    NbAccordionModule,
    NbTreeGridModule,
    NgxEchartsModule,
  ]
})
export class PerformanceModule { }
