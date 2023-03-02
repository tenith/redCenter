import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { FirebaseAuthenticationService } from '../@core/shared/services/firebase-authentication.service';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu = MENU_ITEMS;

  /*
    02 Mar 2023 wutthichair
      Implement constructor, ngOnInit for showing toast when login with outside airasia domain
  */
  constructor(public firebaseUser: FirebaseAuthenticationService, public toastr: NbToastrService){}

  ngOnInit(): void {
    if(!this.firebaseUser.getFirebaseUser().email.includes("@airasia.com")){
      this.toastr.danger('error','Invalid Airasia Email');
    }

  }
}
