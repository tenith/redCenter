import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FirestoreUser } from '../../@core/shared/interfaces/firestore-user';
import { FirestoreUserService } from '../../@core/shared/services/firestore-user.service';
import { RoleConfirmationComponent } from '../role-confirmation/role-confirmation.component';

import { aocOptions, levelOptions, roleOptions } from '../../@core/shared/interfaces/aoc-role-level';

@Component({
  selector: 'ngx-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  tempFirestoreUser: FirestoreUser;

  roleOptions = roleOptions;
  levelOptions = levelOptions
  aocOptions = aocOptions;

  // myRole: string;
  // myAoc: string;
  dialogRef: NbDialogRef<RoleConfirmationComponent>;

  loading: boolean =true;
  constructor(private dialogService: NbDialogService, private firestoreUserService: FirestoreUserService, private toastr: NbToastrService, public router: Router) {}

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
        this.tempFirestoreUser = this.firestoreUserService.getFirestoreUser();
        this.loading = false;
      }
      // console.log('temp Firestore : ' + JSON.stringify(this.tempFirestoreUser));
    });          
  }

  setInitialUser(): void{
    // console.log(JSON.stringify(this.tempFirestoreUser));

    this.dialogRef = this.dialogService.open(RoleConfirmationComponent,{
      context: {
        data: {
          role:this.tempFirestoreUser.role,
          aoc:this.tempFirestoreUser.aoc, 
        }
      }
    });
    
    this.dialogRef.onClose.subscribe(confirm => {
      if(confirm == 'affirm'){
        this.firestoreUserService.setInitialUser(this.tempFirestoreUser.aoc, this.tempFirestoreUser.role)
        .then(()=>{
          this.router.navigate(['./pages']);  
        })
        .catch(()=>{ 
          this.toastr.danger('Error','There is something wrong Please try again.', {duration:5000});
        });
      } 
    });
  }

}
