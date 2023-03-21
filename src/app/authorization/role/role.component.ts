import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FirestoreUserService } from '../../@core/shared/services/firestore-user.service';
import { RoleConfirmationComponent } from '../role-confirmation/role-confirmation.component';

@Component({
  selector: 'ngx-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  myRole: string;
  dialogRef: NbDialogRef<RoleConfirmationComponent>;

  constructor(private dialogService: NbDialogService, private firestoreUserService: FirestoreUserService, public router: Router) {}

  ngOnInit(): void {
    if(this.firestoreUserService.hasRole()){
      this.router.navigate(['./pages']);
    }
  }

  setRole(role: string): void{
    this.myRole = role;
    this.dialogRef = this.dialogService.open(RoleConfirmationComponent,{context:{role:this.myRole}});
    
    this.dialogRef.onClose.subscribe(confirmRole => {
      console.log('confirm ' + confirmRole);
      this.firestoreUserService.initRole(confirmRole as string);
      this.router.navigate(['./pages']);
    })
  }

}
