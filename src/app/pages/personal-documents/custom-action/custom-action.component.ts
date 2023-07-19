import { Component, Input, OnInit, Output } from '@angular/core';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { FileUploadDatabaseService } from '../../../@core/shared/services/file-upload-database.service';
import { FileUploadInformation } from '../../../@core/shared/interfaces/file-upload-information';
import { EventEmitter } from '@angular/core';
import { FileReportService } from '../../../@core/shared/services/file-report.service';
import { ViewDocumentComponent } from '../view-document/view-document.component';
import { EditPersonalDocumentComponent } from '../edit-personal-document/edit-personal-document.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-custom-action',
  templateUrl: './custom-action.component.html',
  styleUrls: ['./custom-action.component.scss']
})
export class CustomActionComponent implements OnInit {

  @Input() rowData: any;
  canDelete: boolean = false;
  canAdd: boolean = true;
  canEdit: boolean = false;
  
  @Output() addEvent = new EventEmitter<string>();
  

  dialogRef: NbDialogRef<DeleteConfirmationComponent>;
  viewDialogRef: NbDialogRef<ViewDocumentComponent>;

  constructor(private formBuilder:FormBuilder, private reportService: FileReportService, private dialogService: NbDialogService, private toastr: NbToastrService, private firestoreUserService: FirestoreUserService, private fileUploadDatabaseService: FileUploadDatabaseService) { }

  ngOnInit(): void {
    if(this.rowData.owner == this.firestoreUserService.getFirestoreUser().email){
      this.canDelete = true;
      if(this.firestoreUserService.isModerator || this.firestoreUserService.isAdmin)
        if(this.rowData.hasExpiry == 'Yes')
          this.canEdit = true;
    }    
  }

  editDocument(): void {
    console.log('send data: ' + JSON.stringify(this.rowData));
    this.dialogService.open(EditPersonalDocumentComponent,{
      context: {
        data: {...this.rowData},
        formBuilder: this.formBuilder.group({
          issueDate: [this.rowData.issueDate, Validators.required],
          hasExpiry: [this.rowData.hasExpiry], 
          expiryDate: [this.rowData.expiryDate, Validators.required]
        }),
      }
    });
  }
  
  viewDocument(): void {
    this.viewDialogRef = this.dialogService.open(ViewDocumentComponent,{
      context: {
        data: {
          myCode:this.rowData.name.split('_')[1],
          path:this.rowData.path,
          fileInfo: {...this.rowData}
        }
      }
    });
  }

  deleteDocument(): void{
    this.dialogRef = this.dialogService.open(DeleteConfirmationComponent,{
      context: {
        data: {
          myCode:this.rowData.name.split('_')[1],
        }
      }
    });

    this.dialogRef.onClose.subscribe(confirm => {
      if(confirm == 'affirm'){
        //Delete an announcement code....
        this.fileUploadDatabaseService.deleteFile(this.rowData.path, {...this.rowData} as FileUploadInformation).then(()=>{
          this.toastr.primary('Completed','Delete ' + this.rowData.name.split('_')[1] + ' announement completed');
        })
        .catch(error=>{
          // console.log(error);
          this.toastr.danger('error','Delete ' + this.rowData.name.split('_')[1] + ' announement failed, try again later');
        });
      }
    });
  }

  addDocument(): void{
    this.reportService.addFileToReport({...this.rowData} as FileUploadInformation);
  }

  removeDocument(): void{
    this.reportService.deleteFileFromReport({...this.rowData} as FileUploadInformation);
  }

}
