import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FirestoreUser } from '../../@core/shared/interfaces/firestore-user';
import { FirestoreUserService } from '../../@core/shared/services/firestore-user.service';
import { ConfirmationComponent } from './confirmation/confirmation.component';

import { aocOptions, levelOptions, roleOptions } from '../../@core/shared/interfaces/aoc-role-level';

@Component({
  selector: 'ngx-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {
  loading = true;
  firestoreUser: FirestoreUser;

  searchEmail: string;

  dialogRef: NbDialogRef<ConfirmationComponent>;

  roleOptions = roleOptions;
  levelOptions = levelOptions
  aocOptions = aocOptions;

  constructor(private firestoreUserService: FirestoreUserService, private toastr: NbToastrService, private dialogService: NbDialogService) { }

  ngOnInit(): void {
  }

  search(): void {
    console.log('search() : ' + this.searchEmail);    
    
    this.firestoreUser = null;
    this.loading = true;

    this.firestoreUserService.getFirestoreUserByEmail(this.searchEmail).then(data => {
      this.loading = false;
      if(data != null){
        this.firestoreUser = data.data() as FirestoreUser;
      }
    });
  }

  delete(): void{
    if(this.firestoreUser == null)
      return;
    
    if(this.searchEmail == this.firestoreUserService.getFirestoreUser().email)
      return;

    this.dialogRef = this.dialogService.open(ConfirmationComponent);
    this.dialogRef.onClose.subscribe(confirmation => {
      console.log('result ' + confirmation);
      if(confirmation == 'confirm'){
        console.log('delete user');
        // this.firestoreUserService.deleteFirestoreUser(this.firestoreUser)
        // .then(()=>{
        //   this.toastr.primary('Completed','Delete ' + this.firestoreUser.email + ' completed', {duration:5000});
        //   this.reset();
        // })
        // .catch(()=>{
        //   this.toastr.danger('Error','There is something wrong Please try again.', {duration:5000});
        //   this.reset();
        // });
      }
    });
    
    
  }

  update(): void {
    this.firestoreUserService.reviseFirestoreUser(this.firestoreUser)
    .then(()=>{
      this.toastr.primary('Completed','Updated ' + this.firestoreUser.email + ' completed', {duration:5000});
      this.reset();
    })
    .catch(()=>{
      this.toastr.danger('Error','There is something wrong Please try again.', {duration:5000});
      this.reset();
    });


  }

  reset(): void {
    this.loading = true;
    this.firestoreUser = null;
    this.searchEmail = '';
  }

}
