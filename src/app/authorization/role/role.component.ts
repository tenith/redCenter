import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FirestoreUser } from '../../@core/shared/interfaces/firestore-user';
import { FirestoreUserService } from '../../@core/shared/services/firestore-user.service';
import { RoleConfirmationComponent } from '../role-confirmation/role-confirmation.component';

@Component({
  selector: 'ngx-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  tempFirestoreUser: FirestoreUser;

  myRole: string;
  dialogRef: NbDialogRef<RoleConfirmationComponent>;

  loading: boolean =true;
  constructor(private dialogService: NbDialogService, private firestoreUserService: FirestoreUserService, public router: Router) {}

  ngOnInit(): void {
    //Already has role, user can process to pages.
    if(this.firestoreUserService.hasRole()){
      this.router.navigate(['./pages']);
      return;
    }

    
    this.firestoreUserService.getFirestoreUserFromServer().then((doc)=> {
      if (doc.exists) {
        // console.log('getFirestoreUserFromServer :' + JSON.stringify(doc.data()));
        this.tempFirestoreUser = {...doc.data()} as FirestoreUser;

        this.firestoreUserService.setFirestoreUser(this.tempFirestoreUser);
        
        if(this.tempFirestoreUser.role != '')
          this.router.navigate(['./pages']);

        this.loading = false;
      }
      else{
        this.firestoreUserService.initDefaultFirestoreUser();
        this.loading = false;
      }
    });
          
  }

  setRole(role: string): void{
    this.myRole = role;
    this.dialogRef = this.dialogService.open(RoleConfirmationComponent,{context:{role:this.myRole}});
    
    this.dialogRef.onClose.subscribe(confirmRole => {
      if(confirmRole != ''){
        this.firestoreUserService.setRole(confirmRole as string);
        this.router.navigate(['./pages']);
      }
    })
  }

}
