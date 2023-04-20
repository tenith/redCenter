import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { FileUploadInformationService } from '../../../@core/shared/services/file-upload-information.service';
import { FileUploadDatabaseService } from '../../../@core/shared/services/file-upload-database.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  uploadForm: FormGroup;
  fileToUpload: File = null;

  constructor(private formBuilder: FormBuilder, private toastr: NbToastrService, private firestoreUserService: FirestoreUserService, private fileUploadInformationService: FileUploadInformationService, private fileUploadDatabaseService: FileUploadDatabaseService) { 
  }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      fileUpload: ['', Validators.required],
      fileDescription: ['', Validators.required]
    });    
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  async upload(): Promise<void>{
    // console.log('Upload...');
    // console.log(JSON.stringify(this.uploadForm.value));

    // console.log('TYPE: ' + typeof this.fileToUpload);
    // console.log('NAME: ' + this.fileToUpload.name);

    // console.log('Description: ' + this.uploadForm.get('fileDescription').value);

    await this.fileUploadDatabaseService.uploadFile(this.fileToUpload,this.uploadForm.get('fileDescription').value)
    .then(response => {
      if(response){
        this.toastr.primary('Completed','Upload file completed', {duration:5000});
        this.reset();
      }
      else { 
        this.toastr.danger('Error','There is something wrong Please try again.', {duration:5000});
        this.reset();
      }
    })
    .catch(error=> console.log(error));
  }

  reset(): void{
    this.fileToUpload = null;
    this.uploadForm.reset();
  }

}
