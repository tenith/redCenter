import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Announcement } from '../../../@core/shared/interfaces/announcement';
import { Signature } from '../../../@core/shared/interfaces/signature';
import { AnnouncementService } from '../../../@core/shared/services/announcement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { Invoice } from '../../../@core/shared/interfaces/invoice';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { NgxWatermarkOptions } from 'ngx-watermark';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NotificationService } from '../../../@core/shared/services/notification.service';

@Component({
  selector: 'ngx-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  acknowledgeRequired: boolean = true;
  isAcknowledge: boolean = false;
  readOnly: boolean = false;
  loading: boolean = true;
  notFound: boolean = true;
  
  invoice: Invoice;
  announcement: Announcement;

  ngxWaterMarkOptions: NgxWatermarkOptions = {
    text: '',
    color: '#999',
    width: 300,
    height: 300,
    alpha: 0.4,
    degree: -45,
    fontSize: '20px',
  };

  signatures: Signature[] = [];

  isModerator: boolean = false;

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      index: { title:'No', filter: false, sort: false, valuePrepareFunction(value,row,cell){return cell.row.index + 1;}},
      dateTime: { title: 'Date Time of Acknowledge', filter: false, sort:false, valuePrepareFunction: (date) => {
        const datePipe = new DatePipe('en-US');        
        const formattedDate = datePipe.transform(date, 'dd MMM yyyy HH:mm:ss');

        // console.log(formattedDate)
        return formattedDate.toUpperCase();
      },},
      displayName: { title: 'Name', filter: false, sort:false },
      email: { title: 'Email', filter: false, sort:false },
    },
  };

  source: LocalDataSource;

  @ViewChild('printSummary', { static: false }) public dataToExport: ElementRef;
  
  constructor(private router:Router, private notificationService: NotificationService, private announcementService: AnnouncementService, private route: ActivatedRoute, private toastr: NbToastrService, private firestoreUserService: FirestoreUserService) { }

  setUpAnnouncement(code: string): void {
    this.announcement = this.announcementService.getAnnouncementFromCache(code);
    if(this.announcement){
      this.loading = false;
      this.notFound = false;

      this.revisedAcknowledge();
    }


    this.announcementService.getAnnouncement(code).then(doc=>{
      // console.log(JSON.stringify(doc.data()));
      this.announcement = doc.data();
      if(this.announcement == null){
        this.router.navigate(['./pages/documents_amendment']);
        this.toastr.danger('Error','Invalid Document, Please check your dashboard again.', {duration:5000});
        return;
      }
      this.loading =  false;
      this.notFound = false;

      this.revisedAcknowledge();
    })
    .catch(error=>{
      // console.log(error);
      this.toastr.danger('Error','There is something wrong Please try again later.', {duration:5000});
    });
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        const tempCode = params.code;
        this.setUpAnnouncement(tempCode);
      }
    );

    const temp = this.firestoreUserService.getFirestoreUser();
    if(temp.level != 'Subscriber')
      this.isModerator = true;
  }

  revisedAcknowledge(): void {
    this.acknowledgeRequired = this.announcement.acknowledge == 'No' ? false: true;

    const tempIndex  = this.firestoreUserService.isAcknowledge(this.announcement.code);
    if(tempIndex >= 0){
      this.isAcknowledge = true;
      this.invoice = this.firestoreUserService.getInvoice(tempIndex);
    }
    
    this.notificationService.deleteNotificationReadOnlyDocuemntByCode(this.announcement.code);

    this.signatures = this.announcement.signatures;
    this.source = new LocalDataSource(this.signatures);

    // console.log(JSON.stringify(this.announcement));
    this.ngxWaterMarkOptions.text = this.firestoreUserService.getFirestoreUser().email;
  }

  printPDF(): void{
    const doc = new jsPDF();
    const content = this.dataToExport.nativeElement;

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position += heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('div.pdf');
    }); 
  }

  sign(code: string, title: string): void{
    let firestoreUser = this.firestoreUserService.getFirestoreUser();

    const timeStamp = new Date().toLocaleString();
    const tempSignature = {email:firestoreUser.email,displayName:firestoreUser.displayName,dateTime: timeStamp} as Signature;
    const invoice = {uuid: encodeURIComponent(code),title:title, dateTime: timeStamp} as Invoice;

    this.announcementService.addAcknowledgement(encodeURIComponent(code),tempSignature).then(()=>{
      this.toastr.primary('Completed','Acknowledge completed');

      this.firestoreUserService.addAcknowledgement(this.firestoreUserService.getFirestoreUser(),invoice).then(()=>{
        firestoreUser.invoice.push(invoice);
        this.firestoreUserService.setFirestoreUser(firestoreUser);

        this.revisedAcknowledge();
        this.toastr.primary('Completed','Acknowledge has been save into your device');

        this.notificationService.deleteNotificationDocuemntByCode(this.announcement.code);
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
