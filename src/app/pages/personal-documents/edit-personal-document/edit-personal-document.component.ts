import { ChangeDetectorRef, Component, Inject, Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { FileUploadInformationService } from '../../../@core/shared/services/file-upload-information.service';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription, fromEvent } from 'rxjs';
import { NbDialogRef } from '@nebular/theme';
import { FileUploadInformation } from '../../../@core/shared/interfaces/file-upload-information';
import { DatePipe } from '@angular/common';
import { ngxWaterMarkOptions } from '../../../../environments/myconfigs';
import { NgxWatermarkOptions } from 'ngx-watermark';
import { FileUploadDatabaseService } from '../../../@core/shared/services/file-upload-database.service';

@Component({
  selector: 'ngx-edit-personal-document',
  templateUrl: './edit-personal-document.component.html',
  styleUrls: ['./edit-personal-document.component.scss']
})
export class EditPersonalDocumentComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() formBuilder: FormGroup | any;
  uploadForm: FormGroup | any;

  downloadUrl$: Observable<string>;
  ngxWaterMarkOptions: NgxWatermarkOptions = ngxWaterMarkOptions;

  uploading: boolean = false;

  initData: any;

  offline:boolean = true;
  offlineEvent: Observable<Event>;
  onlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];
  
  constructor(
    private fileUploadDatabaseService: FileUploadDatabaseService,
    private dialogRef: NbDialogRef<EditPersonalDocumentComponent>,
    private fileUploadInfoService: FileUploadInformationService, 
    private cdr: ChangeDetectorRef,    
    private firestoreUserService: FirestoreUserService) { }

  ngOnInit(): void {
    this.handleAppConnectivityChanges();
    this.uploadForm = this.formBuilder;

    this.downloadUrl$ = this.fileUploadDatabaseService.getFile(this.data.relativePath);

    this.uploadForm.controls['issueDate'].valueChanges.subscribe(value => {
      this.reviseExpireDate();
    })
    
    this.initData = {...this.data};
  }

  private reviseExpireDate(): void {
    const attendedDateString = new Date(this.uploadForm.get('issueDate').value); 
    const datePipe = new DatePipe('en-US');    
    const last12Month = datePipe.transform(new Date(attendedDateString.getFullYear(),attendedDateString.getMonth() + 13,0), 'yyyy-MM-dd');

    if(this.data.description.includes('Medical'))
      this.uploadForm.get('expiryDate').setValue(last12Month);
  }

  upload(): void {
    this.data.issueBy = this.uploadForm.get('issueBy').value;
    this.data.issueDate = this.uploadForm.get('issueDate').value;
    this.data.expiryDate = this.uploadForm.get('expiryDate').value;
    this.data.uploadTime = new Date().toLocaleString();
    this.data.verify = true;

    this.fileUploadInfoService.removeFileUploadInformation(this.initData as FileUploadInformation, this.data.owner);
    this.fileUploadInfoService.addFileUploadInformation(this.data as FileUploadInformation, this.data.owner);

    this.cancel();
  }

  cancel(): void {
    this.dialogRef.close('');
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
