import { Component, Input, OnInit } from '@angular/core';
import { Announcement } from '../../../@core/shared/interfaces/announcement';
import { Signature } from '../../../@core/shared/interfaces/signature';
import { AnnouncementService } from '../../../@core/shared/services/announcement.service';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { Invoice } from '../../../@core/shared/interfaces/invoice';

@Component({
  selector: 'ngx-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  isAcknowledge: boolean = false;
  loading: boolean = true;
  notFound: boolean = true;
  
  invoice: Invoice;
  announcement: Announcement;
  
  constructor(private announcementService: AnnouncementService, private route: ActivatedRoute, private toastr: NbToastrService, private firestoreUserService: FirestoreUserService) { }

  setUpAnnouncement(code: string): void {
    this.announcement = this.announcementService.getAnnouncementFromCache(code);
    if(this.announcement){
      this.loading = false;
      this.notFound = false;

      this.revisedAcknowledge();
    }
    else{
      this.announcementService.getAnnouncement(code).then(doc=>{
        // console.log(JSON.stringify(doc.data()));
        this.announcement = doc.data();
        this.loading =  false;
        this.notFound = false;

        this.revisedAcknowledge();
      })
      .catch(error=>{
        // console.log(error);
        this.toastr.danger('Error','There is something wrong Please try again later.', {duration:5000});
      });
    }
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        const tempCode = params.code;
        this.setUpAnnouncement(tempCode);
      }
    );
  }

  revisedAcknowledge(): void {
    const tempIndex  = this.firestoreUserService.isAcknowledge(this.announcement.code);
    if(tempIndex >= 0){
      this.isAcknowledge = true;
      this.invoice = this.firestoreUserService.getInvoice(tempIndex);
    }
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
