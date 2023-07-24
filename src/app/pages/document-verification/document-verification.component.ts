import { Component, OnInit } from '@angular/core';
import { FileVerificationService } from '../../@core/shared/services/file-verification.service';
import { FileUploadInformation } from '../../@core/shared/interfaces/file-upload-information';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomActionComponent } from './custom-action/custom-action.component';

import { DatePipe } from '@angular/common';

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
          
          const datePipe = new DatePipe('en-US');
          const formattedDate = datePipe.transform(date, 'dd MMM yyy HH:mm:ss');
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

  constructor(private fileVerifyService: FileVerificationService) { }

  ngOnInit(): void {
    this.fileVerifyService.getNeedVerifyList().subscribe(data=>{
      this.fileInforList = [];

      for(let i=0; i < data.length; i++){
        for(let j=0; j < data[i].files.length; j++){
          const temp = data[i].files[j] as FileUploadInformation;
          if(temp.verify == false)
            this.fileInforList.push(temp);
        }
      }

      this.refresh();
    });
  }

  refresh(): void {
    const temp = this.fileInforList;
    this.source = new LocalDataSource([...temp]);
  }

}
