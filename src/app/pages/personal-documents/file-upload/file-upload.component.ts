import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { FileUploadInformationService } from '../../../@core/shared/services/file-upload-information.service';
import { FileUploadDatabaseService } from '../../../@core/shared/services/file-upload-database.service';
import { NbToastrService } from '@nebular/theme';
import { PersonalNotificationService } from '../../../@core/shared/services/personalDocumentNotification.service';

@Component({
  selector: 'ngx-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy, AfterViewInit {

  uploadForm: FormGroup;
  fileToUpload: File = null;
  uploading: boolean = false;
  uploadFormSubject: any;

  toShowSEP: boolean = false;
  toShowExpiry: boolean = false;
  
  constructor(private personalDocNotification: PersonalNotificationService, private formBuilder: FormBuilder, private toastr: NbToastrService, private firestoreUserService: FirestoreUserService, private fileUploadInformationService: FileUploadInformationService, private fileUploadDatabaseService: FileUploadDatabaseService) { 
  }

  ngAfterViewInit(): void {
    this.uploadFormSubject = this.uploadForm.valueChanges.subscribe((value)=>{ this.reviseRequired();});
  }

  ngOnDestroy(): void {
    if(!this.uploadFormSubject)
      this.uploadFormSubject.unsubscribe();
  }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      fileUpload: ['', Validators.required],
      fileCategory: ['', Validators.required],
      fileDescription: ['', Validators.required],     
      showSEP: ['No', Validators.required],
      issueDate: ['',],
      hasExpiry: ['',],
      expiryDate: ['',],
      issueBy: ['',],
    });    
  }

  reviseRequired(): void {
    if(this.uploadForm.get('showSEP').value == 'Yes'){
      this.uploadForm.get('issueDate').setValidators([Validators.required]);
      this.uploadForm.get('hasExpiry').setValidators([Validators.required]);
      this.uploadForm.get('issueBy').setValidators([Validators.required]);

      this.toShowSEP = true;
    }
    else{
      this.uploadForm.get('issueDate').clearValidators();
      this.uploadForm.get('hasExpiry').clearValidators();
      this.uploadForm.get('issueBy').clearValidators();

      this.toShowSEP = false;
    }

    if(this.uploadForm.get('hasExpiry').value == 'Yes'){
      this.uploadForm.get('expiryDate').setValidators([Validators.required]);

      this.toShowExpiry = true;
    }
    else{
      this.uploadForm.get('expiryDate').clearValidators();

      this.toShowExpiry = false;
    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  async upload(): Promise<void>{

    console.log('Upload...');
    console.log(JSON.stringify(this.uploadForm.value));
    
    this.uploading = true;
    await this.fileUploadDatabaseService.uploadFile(this.fileToUpload,this.uploadForm.value)
    .then(response => {
      if(response){
        this.toastr.primary('Completed','Upload file completed', {duration:5000});
        this.personalDocNotification.PersonalDocumentNotification(this.uploadForm.get('fileCategory').value, this.firestoreUserService.getFirestoreUser().email);
        this.reset();
      }
      else { 
        this.toastr.danger('Error','There is something wrong Please try again.', {duration:5000});
        this.reset();
      }
    })
    .catch(error=> console.log(error));
    this.uploading = false;
  }

  reset(): void{
    this.fileToUpload = null;
    this.uploadForm.reset();
  }

}
