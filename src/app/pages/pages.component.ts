import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbToastrService } from '@nebular/theme';
import { FirebaseAuthenticationService } from '../@core/shared/services/firebase-authentication.service';
import { FirestoreUserService } from '../@core/shared/services/firestore-user.service';

import { allowMenuByRole, menuListDetail } from './pages-menu';
import { roleName, userLevel } from '../../environments/myconfigs';

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
  menu: NbMenuItem[];
  /*
    02 Mar 2023 wutthichair
      Implement constructor, ngOnInit for showing toast when login with outside airasia domain
  */
  constructor(public firebaseUser: FirebaseAuthenticationService, public toastr: NbToastrService, public firestoreUserService: FirestoreUserService){
    let tempFirestoreUser = this.firestoreUserService.getFirestoreUser();
    let tempMenu: NbMenuItem[] = [];
    let myList: string[];

    if(tempFirestoreUser.level == 'Admin'){
      myList = allowMenuByRole['Admin'];
    }
    else{
      myList = allowMenuByRole[tempFirestoreUser.role];
    }

    // console.log('My menu list' + JSON.stringify(myList));
    for(let i=0;i<myList.length;i++){
      // console.log('add menu detail ' + myList[i]);
      if(menuListDetail[myList[i]].title == 'E-TS1'){
        if(tempFirestoreUser.role == roleName.pilot && tempFirestoreUser.level == userLevel.subscriber)
          menuListDetail[myList[i]].children.splice(0,1);
      }
      tempMenu.push(menuListDetail[myList[i]]);
    }

    this.menu = tempMenu;
    // let temp = menuList[tempFirestoreUser.role];
    // /**
    //  * Normal User will be remove all moderator menu.
    //  */
    // if(tempFirestoreUser.level.includes('subscriber')){
    //   for(let i=0;i<temp.length;i++){
    //     if(temp[i].children != null || temp[i].children != undefined)
    //       for(let j=0;j<temp[i].children.length;j++)
    //         if(temp[i].children[j].title.includes('Moderator'))
    //           temp[i].children.splice(j--,1);
    //   }
      
    //   this.menu = [...temp] as NbMenuItem[];
    // }
  }

  ngOnInit(): void {
    if(!this.firebaseUser.getFirebaseUser().email.includes("@airasia.com")){
      this.toastr.danger('error','Invalid Airasia Email');
    }

  }
}
