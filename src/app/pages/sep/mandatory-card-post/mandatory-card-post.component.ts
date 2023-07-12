import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { NbToastrService } from '@nebular/theme';
import { FileUploadInformationService } from '../../../@core/shared/services/file-upload-information.service';
import { FileUploadDatabaseService } from '../../../@core/shared/services/file-upload-database.service';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { PersonalNotificationService } from '../../../@core/shared/services/personalDocumentNotification.service';

import * as uuid from 'uuid';

@Component({
  selector: 'ngx-mandatory-card-post',
  templateUrl: './mandatory-card-post.component.html',
  styleUrls: ['./mandatory-card-post.component.scss']
})
export class MandatoryCardPostComponent implements OnInit, OnDestroy, AfterViewInit {
  uploadForm: FormGroup;
  fileToUpload: File = null;
  uploading: boolean = false;
  
  isProfile: boolean = false;

  @Input() name!: string;
  @Output() postCompleteEvent = new EventEmitter<string>();

  offline:boolean = true;
  offlineEvent: Observable<Event>;
  onlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder, 
    private personalDocNotification: PersonalNotificationService,
    private toastr: NbToastrService, 
    private firestoreUserService: FirestoreUserService, 
    private fileUploadInformationService: FileUploadInformationService, 
    private cdr: ChangeDetectorRef,
    private fileUploadDatabaseService: FileUploadDatabaseService) { }

  ngAfterViewInit(): void {
    // this.uploadFormSubject = this.uploadForm.valueChanges.subscribe((value)=>{ this.reviseRequired();});
  }

  ngOnDestroy(): void {
    // if(!this.uploadFormSubject)
    //   this.uploadFormSubject.unsubscribe();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      fileUpload: ['', Validators.required],
      fileCategory: [this.name, ],
      fileDescription: [this.name + '_manualUpload',],     
      showSEP: ['Yes', ],
      issueDate: ['', Validators.required],
      hasExpiry: ['Yes', ],
      expiryDate: ['', Validators.required],
      issueBy: ['', Validators.required],
    });    

    if(this.name == 'My Picture'){
      this.isProfile = true;
      this.uploadForm.get('issueDate').clearValidators();
      this.uploadForm.get('expiryDate').clearValidators();
      this.uploadForm.get('issueBy').clearValidators();
    }

    this.handleAppConnectivityChanges();
  }

  private handleAppConnectivityChanges(): void {
    this.offline = !navigator.onLine;
    
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      // handle online mode
      this.offline = false;
      this.cdr.detectChanges();
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      // handle offline mode
      this.offline = true;
      this.cdr.detectChanges();
    }));
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  reviseRequired(): void { }

  async upload(): Promise<void>{

    if(this.isProfile){
      this.uploadForm.get('hasExpiry').setValue('No');
      this.uploadForm.get('issueDate').setValue('-');
      this.uploadForm.get('expiryDate').setValue('-');
    }
    
    this.uploading = true;
    await this.fileUploadDatabaseService.uploadFile(this.fileToUpload,this.uploadForm.value)
    .then(response => {
      if(response){
        this.toastr.primary('Completed','Upload file completed', {duration:5000});
        this.personalDocNotification.PersonalDocumentNotification(this.uploadForm.get('fileCategory').value, this.firestoreUserService.getFirestoreUser().email, uuid.v4());
        this.reset();
        this.postCompleteEvent.emit('');
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
