import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from '../../../@core/shared/services/announcement.service';
import { NbToastrService } from '@nebular/theme';
import { Signature } from '../../../@core/shared/interfaces/signature';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { Invoice } from '../../../@core/shared/interfaces/invoice';
import { error } from 'console';

@Component({
  selector: 'ngx-documents-amendment-table',
  templateUrl: './documents-amendment-table.component.html',
  styleUrls: ['./documents-amendment-table.component.scss']
})
export class DocumentsAmendmentTableComponent implements OnInit {

  constructor(private firestoreUserService: FirestoreUserService, private announcementService: AnnouncementService, private toastr: NbToastrService) { }

  ngOnInit(): void {
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
