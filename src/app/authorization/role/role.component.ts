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

  myRole: string;
  dialogRef: NbDialogRef<RoleConfirmationComponent>;

  loading: boolean =true;
  constructor(private dialogService: NbDialogService, private firestoreUserService: FirestoreUserService, public router: Router) {}

  ngOnInit(): void {
    if(this.firestoreUserService.hasRole()){
      this.router.navigate(['./pages']);
      return;
    }

    let temp: FirestoreUser;
    this.firestoreUserService.getFirestoreUser().then(async (doc)=> {
      if (doc.exists) {
        console.log('reload from server ' + JSON.stringify(doc.data()));
        temp = {...doc.data()} as FirestoreUser;
        this.loading = false;

        console.log('reload from server ' + JSON.stringify(temp));
        if(temp.role != '')
          this.router.navigate(['./pages']);
      }
      else{
        await this.firestoreUserService.createFirestoreUser();
        this.loading = false;
      }
    });
      
      
    
    // if(this.firestoreUserService.hasRole()){
    //   this.router.navigate(['./pages']);
    // }
  }

  setRole(role: string): void{
    this.myRole = role;
    this.dialogRef = this.dialogService.open(RoleConfirmationComponent,{context:{role:this.myRole}});
    
    this.dialogRef.onClose.subscribe(confirmRole => {
      if(confirmRole != ''){
        this.firestoreUserService.initRole(confirmRole as string);
        this.router.navigate(['./pages']);
      }
    })
  }

}
