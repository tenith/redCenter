import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit {

  flight2022Data: any[] = [];
  flight2023Data: any[] = [];

  fuel2022Data: any[] = [];
  fuel2023Data: any[] = [];
  constructor() {}

  ngOnInit(): void {
    const codeList: string[] = ['cs1', 'cs2', 'csx', 'cslx', 'csrx' , 'late MC', 'AWOL', 'Miss Flight', 'MC After Activated', 'Refuse to fly', 'Uncontact', 'Nil Document'];
    const monthList: string[] = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

    let flight2022DataValue = [1,1,1,1,1,1,2,1,1,1,3,4];
    let flight2023DataValue = [0,0,0,0,0,0,0,0,0,0,0,0];

    this.flight2022Data.push(codeList);
    this.flight2022Data.push(flight2022DataValue);

    this.flight2023Data.push(codeList);
    this.flight2023Data.push(flight2023DataValue);

    let fuel2022DataValue = [1,2,3,4,5,6,7,8,9,10,11,12];
    let fuel2023DataValue = [1,2,3,0,1,2,3,0,-1,2,3,0];

    this.fuel2022Data.push(monthList);
    this.fuel2022Data.push(fuel2022DataValue);

    this.fuel2023Data.push(monthList);
    this.fuel2023Data.push(fuel2023DataValue);
  }

}
