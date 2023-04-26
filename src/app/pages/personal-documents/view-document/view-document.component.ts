import { Component, Input, OnInit } from '@angular/core';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { FileUploadDatabaseService } from '../../../@core/shared/services/file-upload-database.service';
import { NbDialogRef } from '@nebular/theme';
import { Observable } from 'rxjs';
import { NgxWatermarkOptions } from 'ngx-watermark';

import { ngxWaterMarkOptions } from '../../../../environments/myconfigs';

@Component({
  selector: 'ngx-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements OnInit {
  @Input() data: any;
  downloadUrl$: Observable<string>;
  ngxWaterMarkOptions: NgxWatermarkOptions = ngxWaterMarkOptions;

  constructor(private dialogRef: NbDialogRef<ViewDocumentComponent>, private firestoreUserService: FirestoreUserService, private fileUploadDatabaseService: FileUploadDatabaseService) { }

  ngOnInit(): void {
    // console.log(JSON.stringify(this.data.path));    
    this.downloadUrl$ = this.fileUploadDatabaseService.getFile(this.data.fileInfo.relativePath);
    this.ngxWaterMarkOptions.text = this.firestoreUserService.getFirestoreUser().email;
  }

  saveToLocal(): void{
  }

  confirm(): void {
    this.dialogRef.close('affirm');
  }

  cancel(): void {
    this.dialogRef.close('');
  }

}
