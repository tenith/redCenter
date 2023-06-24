import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ETS1Service } from '../../../@core/shared/services/e-ts1.service';
import { TabService } from '../../../@core/shared/services/tab.service';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';

@Component({
  selector: 'ngx-custom-action',
  templateUrl: './custom-action.component.html',
  styleUrls: ['./custom-action.component.scss']
})
export class CustomActionComponent implements OnInit {

  @Input() rowData: any;
  @Output() newTab = new EventEmitter<string>();

  canDelete: boolean = false;

  dialogRef: NbDialogRef<DeleteConfirmationComponent>;

  constructor(private firestoreUser:FirestoreUserService, private dialogService: NbDialogService, private eTS1Service: ETS1Service, private tabService: TabService) { 
    this.canDelete = this.firestoreUser.isAdmin || this.firestoreUser.isModerator;
  }

  addNewTab(): void {        
    this.newTab.emit(this.rowData.uuid);
    this.tabService.addViewTab(this.rowData.uuid);
  }

  deleteETS1(): void {
    this.dialogRef = this.dialogService.open(DeleteConfirmationComponent,{
      context: {
        data: {
          title: 'Do you want to delete this eTS1?',
          information: 'You try to delete this eTS1.'
        }
      }
    });
    
    this.dialogRef.onClose.subscribe(confirm => {
      if(confirm == 'affirm'){
        //Delete data from firestore....
        this.tabService.removeViewTab(this.rowData.uuid);
        this.eTS1Service.deleteeTS1(this.rowData.uuid);        
      }
    });
    
  }

  ngOnInit(): void {
  }

}
