import { Component, Input, OnInit } from '@angular/core';
import { AnnouncementService } from '../../../@core/shared/services/announcement.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'ngx-custom-action',
  templateUrl: './custom-action.component.html',
  styleUrls: ['./custom-action.component.scss']
})
export class CustomActionComponent implements OnInit {
  @Input() rowData: any;

  dialogRef: NbDialogRef<DeleteConfirmationComponent>;

  constructor(private dialogService: NbDialogService, private announcementService: AnnouncementService, private toastr: NbToastrService) { }

  ngOnInit(): void {
  }

  encodeTitle(title: string): string {
    return encodeURIComponent(title);
  }

  deleteAnnouncement(): void {
    console.log('delte' + this.rowData.code);
    this.dialogRef = this.dialogService.open(DeleteConfirmationComponent,{
      context: {
        data: {
          myCode:this.rowData.code,
        }
      }
    });

    this.dialogRef.onClose.subscribe(confirm => {
      if(confirm == 'affirm'){
        //Delete an announcement code....
        console.log('delete ' + this.rowData.code);
      }
    });
    return;
    this.announcementService.deleteAnnouncement(encodeURIComponent(this.rowData.code)).then(()=>{
      this.toastr.primary('Completed','Delete ' + this.rowData.code + ' announement completed');
    })
    .catch(error=>{
      console.log(error);
      this.toastr.danger('error','Delete ' + this.rowData.code + ' announement failed, try again later');
    })
  }

}
