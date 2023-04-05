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

  loading = true;
  documentsList: Announcement[] = [];

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      myCommand: { title:'Action & Status ', type:'custom', filter: false, sort:false, renderComponent: CustomActionComponent},
      publishedDate: { title: 'Published Date', type: 'date',
        valuePrepareFunction: (date) => {
          const datePipe = new DatePipe('en-US');
          const formattedDate = datePipe.transform(date, 'dd MMM yyyy');
          return formattedDate.toUpperCase();
        },
      },
      code: { title: 'Code', type: 'custom', renderComponent: CustomLinkComponent,},
      title: { title: 'Title', },
      author: { title: 'Author', },
    },
  };

  source: LocalDataSource;

  constructor(private firestoreUserService: FirestoreUserService, private announcementService: AnnouncementService, private toastr: NbToastrService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.announcementService.getAllAnnouncements().subscribe(data=>{
      this.documentsList = data;
      this.refresh();
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
  }

  refresh(): void {
    this.loading = false;
    this.source = new LocalDataSource(this.documentsList);
    this.cdr.detectChanges();
  }

  testSign(): void{
    const tempCode = 'TAA/MEMO/2023/1';
    const timeStamp = new Date().toLocaleString();
    const tempSignature = {email:'wutthichai.ratanapornsompong@gmail.com',displayName:'Wutthichair',dateTime: timeStamp} as Signature;
    const invoice = {uuid: encodeURIComponent(tempCode),title:tempCode, dateTime: timeStamp} as Invoice;

    this.announcementService.addAcknowledgement(encodeURIComponent(tempCode),tempSignature).then(()=>{
      this.toastr.primary('Completed','Acknowledge completed');

      this.firestoreUserService.addAcknowledgement(this.firestoreUserService.getFirestoreUser(),invoice).then(()=>{
        this.toastr.primary('Completed','Acknowledge has been save into your device');
      })
      .catch(error=>{
        console.log(error);
        this.toastr.danger('error','Acknowledge has been failed to save into your device');
      });
    })
    .catch(error=>{
      console.log(error);
      this.toastr.danger('error','Acknowledge failed');
    });
  }

}
