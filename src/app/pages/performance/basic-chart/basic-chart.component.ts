import { Component, Input, OnInit } from '@angular/core';

import LinearGradient from 'zrender/lib/graphic/LinearGradient';

@Component({
  selector: 'ngx-basic-chart',
  templateUrl: './basic-chart.component.html',
  styleUrls: ['./basic-chart.component.scss']
})
export class BasicChartComponent implements OnInit {

  @Input() inputData: any;
  options: any;
  constructor() { }

  getMaxValue(list: number[]): number{
    if(list == null)
      return 0;

    let max = 0;
    for(let i=0;i<list.length;i++)
      if(list[i] > max)
        max = list[i];

    if(max == 0)
      max = 5;
    return max;
  }

  ngOnInit(): void {
    const dataAxis = this.inputData[0];
    const data = this.inputData[1] as number[];
    const yMax = this.getMaxValue(data);
    const dataShadow = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < data.length; i++) {
      dataShadow.push(yMax);
    }

    this.options = {
      title: {
        text: '',
      },
      xAxis: {
        data: dataAxis,
        axisLabel: {
          inside: false,
          color: '#000',
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        z: 10,
      },
      yAxis: {
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#999',
        },
      },
      dataZoom: [
        {
          type: 'inside',
        },
      ],
      series: [
        {
          // For shadow
          type: 'bar',
          itemStyle: {
            color: 'rgba(0,0,0,0.05)'
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: dataShadow,
          animation: false,
        },
        {
          type: 'bar',
          itemStyle: {
            color: new LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' },
              ]),
            }
          },
          data,
        },
      ],
    };
  }

}
