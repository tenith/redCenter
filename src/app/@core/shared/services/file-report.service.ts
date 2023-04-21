import { Injectable } from '@angular/core';
import { FileUploadInformation } from '../interfaces/file-upload-information';
import { NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs-compat';

@Injectable({
  providedIn: 'root'
})
export class FileReportService {

  fileUploadInformations: FileUploadInformation[] = [];
  private dataSubject = new Subject<any>();

  constructor(private toastr: NbToastrService,) { 
    this.fileUploadInformations = [];
  }

  getObservable() : Observable<any>{
    return this.dataSubject.asObservable();
  }

  getReportInformation(): FileUploadInformation[]{
    return this.fileUploadInformations;
  }

  addFileToReport(fileUploadInformation: FileUploadInformation){
    
    const tempIndex = this.fileUploadInformations.findIndex(object=> { return object.path === fileUploadInformation.path});
    if(tempIndex < 0){
      console.log('add file to report ' + fileUploadInformation.path);
      this.toastr.primary('Completed','Add file ' + fileUploadInformation.name.split('_')[1] + ' to report completed');
      this.fileUploadInformations.push(fileUploadInformation);
      this.dataSubject.next("new");
    }
  }

  resetReport(): void{
    this.fileUploadInformations = [];
  }

  isInList(fileUploadInformation: FileUploadInformation): boolean{
    const tempIndex = this.fileUploadInformations.findIndex(object=> { return object.path === fileUploadInformation.path});
    if(tempIndex >= 0){
      return true;
    }

    return false;
  }

  deleteFileFromReport(fileUploadInformation: FileUploadInformation){
    // 
    const tempIndex = this.fileUploadInformations.findIndex(object=> { return object.path === fileUploadInformation.path});
    if(tempIndex >= 0){
      console.log('remove file from report ' + fileUploadInformation.path);
      this.toastr.primary('Completed','Remove file ' + fileUploadInformation.name.split('_')[1] + ' from report completed');
      this.fileUploadInformations.splice(tempIndex,1);
      this.dataSubject.next("new");
    }
  }
}
