import { Component, Input, OnInit } from '@angular/core';
import { VrService } from '../../../@core/shared/services/vr.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'ngx-custom-action',
  templateUrl: './custom-action.component.html',
  styleUrls: ['./custom-action.component.scss']
})
export class CustomActionComponent implements OnInit {
  dialogRef: NbDialogRef<DeleteConfirmationComponent>;
  @Input() rowData: any;

  constructor(private vrService: VrService, private dialogService: NbDialogService) { 
  }

  ngOnInit(): void {
    console.log(JSON.stringify(this.rowData));
  }

  deleteVR(): void {
    this.dialogRef = this.dialogService.open(DeleteConfirmationComponent,{
      context: {
        data: {
          title: 'Do you want to delete this VR?',
          information: 'You try to delete this VR.'
        }
      }
    });
    
    this.dialogRef.onClose.subscribe(confirm => {
      if(confirm == 'affirm')
        this.vrService.deleteVR(this.rowData.uuid);
    });
  }

}
