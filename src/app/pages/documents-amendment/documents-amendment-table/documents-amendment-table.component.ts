import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AnnouncementService } from '../../../@core/shared/services/announcement.service';
import { NbToastrService } from '@nebular/theme';
import { Signature } from '../../../@core/shared/interfaces/signature';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { Invoice } from '../../../@core/shared/interfaces/invoice';

import { Announcement } from '../../../@core/shared/interfaces/announcement';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { CustomLinkComponent } from '../custom-link/custom-link.component';
import { CustomActionComponent } from '../custom-action/custom-action.component';

@Component({
  selector: 'ngx-documents-amendment-table',
  templateUrl: './documents-amendment-table.component.html',
  styleUrls: ['./documents-amendment-table.component.scss']
})
export class DocumentsAmendmentTableComponent implements OnInit, AfterViewInit{

  canCreate: boolean = false;

  loading = true;
  documentsList: Announcement[] = [];

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
      myCommand: { title:'Action & Status', width:'12%', type:'custom', filter: false, sort:false, renderComponent: CustomActionComponent},
      publishedDate: { title: 'Published Date', sortDirection: 'desc', filter: false, width:'15%', type: 'date',
        valuePrepareFunction: (date) => {
          let formattedDate = '';
          
          try{
            formattedDate = new DatePipe('en-US').transform(date, 'dd MMM yyyy HH:mm:ss');
          }
          catch(e){
            formattedDate = new DatePipe('en_GB').transform(date, 'dd MMM yyyy HH:mm:ss');
          }
          return formattedDate.toUpperCase();
        },
      },
      code: { title: 'Code', width:'20%', type: 'custom', renderComponent: CustomLinkComponent,},
      title: { title: 'Title', },
      author: { title: 'Author', },
    },
  };

  source: LocalDataSource;

  constructor(private firestoreUserService: FirestoreUserService, private announcementService: AnnouncementService, private toastr: NbToastrService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.announcementService.getAllAnnouncements().subscribe(data=>{
      this.documentsList = data;
      this.announcementService.setAnnouncementInCache(this.documentsList);
      this.refresh();
      this.cdr.detectChanges();
    });

    this.canCreate = this.firestoreUserService.canCreate();
  }

  ngAfterViewInit(): void {
  }

  refresh(): void {
    this.loading = false;
    this.source = new LocalDataSource([...this.documentsList]);
    this.cdr.detectChanges();
  }
}
