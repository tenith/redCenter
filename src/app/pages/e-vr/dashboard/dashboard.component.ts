import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { VrService } from '../../../@core/shared/services/vr.service';
import { VrDetail } from '../../../@core/shared/interfaces/vr-detail';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { CustomActionComponent } from '../custom-action/custom-action.component';
import { CrewDetail } from '../../../@core/shared/interfaces/crew-detail';
import { FlightDetail } from '../../../@core/shared/interfaces/flight-detail';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      myCommand: { title:'Action & Status', width:'10%', type:'custom', filter: false, sort:false, renderComponent: CustomActionComponent},
      date: { title: 'Published Date', sortDirection: 'desc', filter: false, width:'10%', type: 'date',
        valuePrepareFunction: (date) => {
          const datePipe = new DatePipe('en-US');
          const formattedDate = datePipe.transform(date, 'dd MMM yyyy');
          return formattedDate.toUpperCase();
        },
      },
      submitTime: { title: 'Submit Date Time', sortDirection: 'desc', filter: false, width:'10%', type: 'date',
        valuePrepareFunction: (date) => {
          if(date == '')
            return '';

          const datePipe = new DatePipe('en-US');
          const formattedDate = datePipe.transform(date, 'dd MMM yyyy HH:mm');
          return formattedDate.toUpperCase();
        },
      },
      formattedCrew: { title: 'Flight Crew',  filter: true, type: 'html',},
      formattedFlight: { title: 'Flight Duty', filter: true, type: 'html',},
      // crews: { title: 'Flight Crews', type: 'string', 
      //   valuePrepareFunction: (crews: CrewDetail[] ) => {
      //     const flightCrews = crews;
      //     console.log(JSON.stringify(flightCrews));
      //     let temp = '';

      //     for(let i=0;i<flightCrews.length;i++){
      //       if(flightCrews[i].position == 'CP*' || flightCrews[i].position == 'CP' ||  flightCrews[i].position == 'SFO' || flightCrews[i].position == 'FO')
      //         temp = temp + flightCrews[i].id + ": " + flightCrews[i].position + " " + flightCrews[i].name + "\n";
      //     }
      //     return temp;
      //   },
      // },
      // flights: { title: 'Flight Duty', 
      //   valuePrepareFunction: (flights: FlightDetail[]) => { 
      //     const flightDetail = flights;
      //     let temp = '';

      //     for(let i=0;i<flightDetail.length;i++){
      //       temp = temp + flightDetail[i].fltNO + ": " + flightDetail[i].from + "-" + flightDetail[i].to + "\n";
      //     }
      //     return temp;
      //   },
      // },
    },
  };

  source: LocalDataSource;

  vrList: any[];
  constructor(private vrService: VrService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.vrService.getAllVR().subscribe(data => {
      this.vrList = [...data] as any;

      this.vrList.forEach(item=> {
        const flightCrews = item.crews;
        let temp = '';

        for(let i=0;i<flightCrews.length;i++){
          if(flightCrews[i].position == 'CP*' || flightCrews[i].position == 'CP' ||  flightCrews[i].position == 'SFO' || flightCrews[i].position == 'FO'){
            if(temp != '')
              temp = temp + "<br>";
            temp = temp + "<b>" + flightCrews[i].id + "</b>: " + flightCrews[i].position + " " + flightCrews[i].name.split(' ')[0];
          }
        }
        
        item.formattedCrew = temp;
      });

      this.vrList.forEach(item=> {
        const flightDuty = item.flights;
        let temp = '';

        for(let i=0;i<flightDuty.length;i++){
          if(temp != '')
              temp = temp + "<br>";
          temp = temp + "<b>" + flightDuty[i].fltNO + "</b>: " + flightDuty[i].from + "-" + flightDuty[i].to;
        }
        
        item.formattedFlight = temp;
      });

      this.refresh();
    });
  }

  private refresh(): void {
    this.source = new LocalDataSource([...this.vrList]);
    this.cdr.detectChanges();
  }

}
