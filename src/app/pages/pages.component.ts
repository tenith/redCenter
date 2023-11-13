import { Component, OnInit } from "@angular/core";
import { NbMenuItem, NbToastrService } from "@nebular/theme";
import { FirebaseAuthenticationService } from "../@core/shared/services/firebase-authentication.service";
import { FirestoreUserService } from "../@core/shared/services/firestore-user.service";

import { allowMenuByRole, menuListDetail } from "./pages-menu";
import {
  ETS1UserList,
  roleName,
  userLevel,
} from "../../environments/myconfigs";
import { showMenu } from "../../environments/environment";

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu" expanded="false"></nb-menu>
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
  constructor(
    public firebaseUser: FirebaseAuthenticationService,
    public toastr: NbToastrService,
    public firestoreUserService: FirestoreUserService
  ) {
    let tempFirestoreUser = this.firestoreUserService.getFirestoreUser();
    let tempMenu: NbMenuItem[] = [];
    let myList: string[];

    let isETS1User = false;

    isETS1User = ETS1UserList.includes(tempFirestoreUser.email);

    if (tempFirestoreUser.level == "Admin") myList = allowMenuByRole["Admin"];
    else myList = allowMenuByRole[tempFirestoreUser.role];

    for (let i = 0; i < myList.length; i++) {
      if (showMenu.includes(menuListDetail[myList[i]].title)) {
        if (
          tempFirestoreUser.role == roleName.cabinCrew &&
          tempFirestoreUser.level == userLevel.subscriber
        ) {
          if (
            menuListDetail[myList[i]].title == "Documents verification" ||
            menuListDetail[myList[i]].title == "Verification History"
          )
            continue;
        }

        /**
         * version 0.4.0 Add feature E-TS1 for instructors
         * by pass adding ETS1 Module if user is not allowed....
         */
        if (tempFirestoreUser.role == roleName.pilot)
          if (menuListDetail[myList[i]].title == "E-TS1" && !isETS1User)
            continue;

        tempMenu.push(menuListDetail[myList[i]]);
      }
    }
    //Revised Show Menu....
    this.menu = tempMenu;
    // console.log(JSON.stringify(this.menu));
  }

  ngOnInit(): void {
    if (!this.firebaseUser.getFirebaseUser().email.includes("@airasia.com")) {
      this.toastr.danger("error", "Invalid Airasia Email");
    }
  }
}
