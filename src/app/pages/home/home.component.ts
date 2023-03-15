import { Component, OnInit } from '@angular/core';
import { FirebaseAuthenticationService } from '../../@core/shared/services/firebase-authentication.service';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading: boolean = true;
  constructor(public fireBaseAuth: FirebaseAuthenticationService) { }

  ngOnInit(): void {
    this.loading = false;
  }

}
