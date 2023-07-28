import { Component, OnInit } from '@angular/core';
import { FileVerificationService } from '../../@core/shared/services/file-verification.service';
import { FileUploadInformation } from '../../@core/shared/interfaces/file-upload-information';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomActionComponent } from './custom-action/custom-action.component';

import { DatePipe } from '@angular/common';
import { FirestoreUserService } from '../../@core/shared/services/firestore-user.service';
import { levelOptions, roleName, userLevel } from '../../../environments/myconfigs';

@Component({
  selector: 'ngx-document-verification',
  templateUrl: './document-verification.component.html',
  styleUrls: ['./document-verification.component.scss']
})
export class DocumentVerificationComponent implements OnInit {

  fileInforList: FileUploadInformation[] = [];

  source: LocalDataSource;
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
      myCommand: { title:'Action & Status', width:'12%', type:'custom', filter: false, sort:false,renderComponent: CustomActionComponent},
      uploadTime: { title: 'Published Date', sortDirection: 'desc', filter: false, width:'15%', type: 'date',
        valuePrepareFunction: (date) => {
          if(date == '' || date == '-')
            return '-';
          
          let formattedDate = '';
          console.log(date);
          try{
            formattedDate = new DatePipe('en-US').transform(date, 'dd MMM yyyy HH:mm:ss');
          }
          catch(e){
            formattedDate = new DatePipe('en_GB').transform(date, 'dd MMM yyyy HH:mm:ss');
          }
          console.log(formattedDate);
          return formattedDate.toUpperCase();
        },
      },
      owner: { title: 'Owner Email', width:'12%',},
      fileCategory: { title: 'Category', width:'12%',},
      description: { title: 'Description', },
      issueDate: { title: 'Issue Date', filter: false, width:'15%', type: 'date',
        valuePrepareFunction: (date) => {
          if(date == '' || date == '-')
            return '-';

          const datePipe = new DatePipe('en-US');
          const formattedDate = datePipe.transform(date, 'dd MMM yyy');
          return formattedDate.toUpperCase();
        },
      },
      expiryDate: { title: 'Expiry Date', filter: false, width:'15%', type: 'date',
        valuePrepareFunction: (date) => {
          if(date == '' || date == '-')
            return '-';

          const datePipe = new DatePipe('en-US');
          const formattedDate = datePipe.transform(date, 'dd MMM yyy');
          return formattedDate.toUpperCase();
        },
      }
      // name: { title: 'Name', valuePrepareFunction: (name) => {
      //   let temp = name.split('_')[1];
      //   return temp;
      // }}
    },
  };

  constructor(private fileVerifyService: FileVerificationService, private firestoreUserService: FirestoreUserService) { }

  ngOnInit(): void {
    this.fileVerifyService.getNeedVerifyList().subscribe(data=>{
      this.fileInforList = [];

      for(let i=0; i < data.length; i++){
        for(let j=0; j < data[i].files.length; j++){
          const temp = data[i].files[j] as FileUploadInformation;
          if(temp.verify == false)
            this.shouldISeeIt(temp);
            // this.fileInforList.push(temp);
        }
      }

      this.refresh();
    });
  }

  refresh(): void {
    const temp = this.fileInforList;
    this.source = new LocalDataSource([...temp]);
  }

  shouldISeeIt(fileUploadInfo: FileUploadInformation): void {
    const level = this.firestoreUserService.getFirestoreUser().level;
    // console.log('level: ' + level);
    /*
      Admin can see all fileUploadInfo
    */
    if(level == userLevel.admin){
      this.fileInforList.push(fileUploadInfo);
      return;
    }
    
    let myRole = this.firestoreUserService.getFirestoreUser().role;
    // console.log('role: ' + myRole);
    // console.log(JSON.stringify(fileUploadInfo));
    /**
     * CCD_TEAM: See only medical
     */
    if(myRole == roleName.ccd_team){
      if(fileUploadInfo.description.includes('[' + roleName.cabinCrew + ']')){
        this.fileInforList.push(fileUploadInfo);
        return;
      }        
    }

    /**
     * Flight Operation: See all pilot documents except English Proficiency
     */
    if(myRole == roleName.fltOPS){
      if(fileUploadInfo.fileCategory != 'English Proficiency'){
        this.fileInforList.push(fileUploadInfo);
        return;
      }
    }

    /**
     * Training: See all English Proficiency of Pilot
     */
    if(myRole == roleName.training){
      if(fileUploadInfo.fileCategory == 'English Proficiency'){
        this.fileInforList.push(fileUploadInfo);
        return;
      }
    }

  }

}
