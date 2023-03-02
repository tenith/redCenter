import { Component, OnInit } from '@angular/core';
import { FirebaseAuthenticationService } from '../../@core/shared/services/firebase-authentication.service';

@Component({
  selector: 'ngx-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(public firebaseAuthen : FirebaseAuthenticationService) { 
  }

  ngOnInit(): void {
  }
}
