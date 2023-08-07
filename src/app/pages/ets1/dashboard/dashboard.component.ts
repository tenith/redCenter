import { DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { CustomActionComponent } from "../custom-action/custom-action.component";
import { ETS1Data } from "../../../@core/shared/interfaces/e-ts1-data";
import { ETS1Service } from "../../../@core/shared/services/e-ts1.service";

import * as uuid from "uuid";
import { FirestoreUserService } from "../../../@core/shared/services/firestore-user.service";
import { instructorList } from "../../../../environments/myconfigs";

@Component({
  selector: "ngx-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  loading = true;
  @Output() addTab = new EventEmitter<string>();
  @Output() deleteData = new EventEmitter<string>();

  source: LocalDataSource;
  eTS1List: ETS1Data[] = [];

  isInstructor: boolean = false;

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: 20,
    },
    columns: {
      myCommand: {
        title: "Action & Status",
        width: "10%",
        type: "custom",
        filter: false,
        sort: false,
        renderComponent: CustomActionComponent,
      },
      date: {
        title: "Session Date",
        sortDirection: "desc",
        filter: false,
        width: "10%",
        type: "date",
        valuePrepareFunction: (date) => {
          if (date == "" || date == "-") return "-";

          const datePipe = new DatePipe("en-US");
          const formattedDate = datePipe.transform(date, "dd MMM yyy");
          return formattedDate.toUpperCase();
        },
      },
      // initDateTime: { title: 'Init Date Time',  filter: false, width:'12%', type: 'date',
      //   valuePrepareFunction: (date) => {
      //     if(date == '' || date == '-')
      //       return '-';

      //     const datePipe = new DatePipe('en-US');
      //     const formattedDate = datePipe.transform(date, 'dd MMM yyy HH:mm:ss');
      //     return formattedDate.toUpperCase();
      //   },
      // },
      submitDateTime: {
        title: "Submit Date Time",
        filter: false,
        width: "12%",
        type: "date",
        valuePrepareFunction: (date) => {
          if (date == "" || date == "-") return "-";

          const datePipe = new DatePipe("en-US");
          const formattedDate = datePipe.transform(date, "dd MMM yyy HH:mm:ss");
          return formattedDate.toUpperCase();
        },
      },
      // },
      // completedDateTime: { title: 'Completed Date Time', filter: false, width:'12%', type: 'date',
      //   valuePrepareFunction: (date) => {
      //     if(date == '' || date == '-')
      //       return '-';

      //     const datePipe = new DatePipe('en-US');
      //     const formattedDate = datePipe.transform(date, 'dd MMM yyy HH:mm:ss');
      //     return formattedDate.toUpperCase();
      //   },
      // },
      rank1: { title: "Rank", width: "10%" },
      name1: { title: "Name" },
      // license1No: { title: 'Trainee License', width:'10%',},
      classRoom: { title: "Classroom", width: "20%" },
      // name3: { title: 'Instructor Name',},
    },
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private eTS1Service: ETS1Service,
    private firestoreUserService: FirestoreUserService,
  ) {}

  ngOnInit(): void {
    this.isInstructor = true;
    // this.isInstructor = instructorList.includes(this.firestoreUserService.getFirestoreUser().email);

    this.eTS1Service.getAlleTS1().subscribe((data) => {
      this.eTS1List = data;
      this.eTS1Service.seteTS1InCache(this.eTS1List);
      this.refresh();
    });
  }

  addExistTab(uuid: string): void {
    this.addTab.emit(uuid);
  }

  addNewTab(): void {
    const tempUUID = uuid.v4();
    this.addTab.emit(tempUUID);
  }

  refresh(): void {
    this.loading = false;
    // console.log('refresh with : ' + this.eTS1List.length);
    this.source = new LocalDataSource([...this.eTS1List]);
    this.cdr.detectChanges();
  }
}
