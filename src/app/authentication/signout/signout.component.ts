import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthenticationService } from '../../@core/shared/services/firebase-authentication.service';

@Component({
  selector: 'ngx-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
export class SignoutComponent implements OnInit {

  constructor(public firebaseAuthen : FirebaseAuthenticationService, public router: Router, public location: Location) { }

  ngOnInit(): void {
    if(this.firebaseAuthen.getFirebaseUser() == null)
    this.router.navigate(['./authentication/signin']);
  }

  public back(): void {
    this.location.back();
  }

}
