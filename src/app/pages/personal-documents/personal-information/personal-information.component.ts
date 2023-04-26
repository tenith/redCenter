import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { EventEmitter } from '@angular/core';
import { FileUploadInformation } from '../../../@core/shared/interfaces/file-upload-information';
import { FileUploadInformationService } from '../../../@core/shared/services/file-upload-information.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomActionComponent } from '../custom-action/custom-action.component';
import { FileReportService } from '../../../@core/shared/services/file-report.service';

@Component({
  selector: 'ngx-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit, OnDestroy {
  @Input() email?: string = '';
  @Output() addEvent = new EventEmitter<string>();
  @Output() removeEvent = new EventEmitter<string>();

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
          const datePipe = new DatePipe('en-US');
          const formattedDate = datePipe.transform(date, 'dd MMM yyy HH:mm:ss');
          return formattedDate.toUpperCase();
        },
      },
      description: { title: 'Description', },
      name: { title: 'Name', valuePrepareFunction: (name) => {
        let temp = name.split('_')[1];
        return temp;
      }}
    },
  };

  fileUploadInformations: FileUploadInformation[];
  

  constructor(private fileReportService:FileReportService, private fileUploadInformationService: FileUploadInformationService, private firestoreUserService: FirestoreUserService, private cdr: ChangeDetectorRef) { 
    // if(this.email == ''){
    //   this.email = this.firestoreUserService.getFirestoreUser().email;
    // }
  }
  
  ngOnDestroy(): void {
    this.fileReportService.resetReport();
  }

  refresh(): void{
    this.source = new LocalDataSource([...this.fileUploadInformations]);
    this.cdr.detectChanges();
  }

  // private reviseFileUploadInformation(): void{
  //   this.fileUploadInformationService.getFileUploadInformation(this.email).then(response => {
  //     this.fileUploadInformations = [...response] as FileUploadInformation[];
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });
  // }

  addPathToParents(path: string): void{
    this.addEvent.emit(path);
  }

  removePathToParents(path: string): void{
    this.removeEvent.emit(path);
  }

  ngOnInit(): void {
    if(this.email == ''){
      this.email = this.firestoreUserService.getFirestoreUser().email;
    }
    this.fileUploadInformationService.getFileUploadInformationSnapshotByEmail(this.email).onSnapshot(docSnapshot=>{
      if(docSnapshot.exists){
        const temp = [...docSnapshot.data().files] as FileUploadInformation[];
        this.fileUploadInformations = temp;

        this.refresh();
      }
    });
  }

}
