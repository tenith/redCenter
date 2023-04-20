import { Component, OnInit } from '@angular/core';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { FileUploadDatabaseService } from '../../../@core/shared/services/file-upload-database.service';
import { FileUploadInformation } from '../../../@core/shared/interfaces/file-upload-information';
import { FileReportService } from '../../../@core/shared/services/file-report.service';
import { ReportComponent } from '../report/report.component';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  emails: string[];
  searchEmail: string;

  dialogRef: NbDialogRef<ReportComponent>;

  constructor(public toastr: NbToastrService, private dialogService: NbDialogService, private firestoreUserService: FirestoreUserService, private fileUploadDatabaseService: FileUploadDatabaseService, private fileReport: FileReportService) { }

  ngOnInit(): void {
    this.reset();
  }

  search(): void {
    this.emails = this.mySplit();
  }

  private mySplit(): string[]{
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    let rawString = this.searchEmail.split(';');
    let temp: string[] = [];
    for(let i=0;i<rawString.length;i++){
      let tempEmail = rawString[i].trim().toLowerCase();
      if(expression.test(tempEmail))
        temp.push(rawString[i].trim().toLowerCase());
    }

    return temp;
  }

  private reset(): void{
    this.searchEmail = '';
    this.emails = [];
  }

  generateReport(): void{
    if(this.fileReport.getReportInformation().length == 0){
      this.toastr.danger('Error','There is no document to be report, Please select at least one document to generate the report', {duration:5000});
      return;
    }
    
    this.dialogRef = this.dialogService.open(ReportComponent,{});
  }

}
