import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { FirestoreUser } from '../../@core/shared/interfaces/firestore-user';
import { FirestoreUserService } from '../../@core/shared/services/firestore-user.service';

@Component({
  selector: 'ngx-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {
  loading = true;
  firestoreUser: FirestoreUser;

  searchEmail: string;

  roleOptions = [
    { value: 'Pilot', label: 'Pilot' },
    { value: 'Cabin_Crew', label: 'Cabin Crew' },
    { value: 'Flight_Operations', label: 'Flight Operations' },
    { value: 'Training', label: 'Training' },
    { value: 'Engineer', label: 'Engineer' },
  ];

  levelOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Moderator', label: 'Moderator' },
    { value: 'Subscriber', label: 'Subscriber' },
  ];

  constructor(private firestoreUserService: FirestoreUserService, private toastr: NbToastrService) { }

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
