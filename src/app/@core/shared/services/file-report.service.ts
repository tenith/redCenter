import { Injectable } from '@angular/core';
import { FileUploadInformation } from '../interfaces/file-upload-information';
import { NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class FileReportService {

  fileUploadInformations: FileUploadInformation[] = [];

  constructor(private toastr: NbToastrService,) { 
    this.fileUploadInformations = [];
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
    }
  }

  resetReport(): void{
    this.fileUploadInformations = [];
  }

  deleteFileFromReport(fileUploadInformation: FileUploadInformation){
    // 
    const tempIndex = this.fileUploadInformations.findIndex(object=> { return object.path === fileUploadInformation.path});
    if(tempIndex >= 0){
      console.log('remove file from report ' + fileUploadInformation.path);
      this.toastr.primary('Completed','Remove file ' + fileUploadInformation.name.split('_')[1] + ' from report completed');
      this.fileUploadInformations.splice(tempIndex);
    }
      
  }
}
