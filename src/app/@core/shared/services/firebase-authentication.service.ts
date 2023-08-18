import { Injectable } from "@angular/core";
/*
  01 Mar 2023 wutthichair
    Import required modules
*/

import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { GoogleAuthProvider } from "firebase/auth";
import { FirebaseUser } from "../interfaces/firebase-user";

import { localStorageCollection } from "../../../../environments/myconfigs";
import { settings } from "../../../../environments/myconfigs";

/*
  01 Mar 2023 wutthichair
    Import required modules
*/

@Injectable({
  providedIn: "root",
})
export class FirebaseAuthenticationService {
  /*
    01 Mar 2023 wutthichair
  */
  private firebaseUser: FirebaseUser;
  private firebaseUserStoreKey =
    localStorageCollection.firebaseUserStoreKeyCollectionName;

  offline: boolean = true;

  /*
    01 Mar 2023 wutthichair
      Revise constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public router: Router)
  */
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {
    this.offline = !navigator.onLine;
    if (this.offline)
      this.firebaseUser = JSON.parse(
        this.getDataWithExpiry(this.firebaseUserStoreKey)
      ) as FirebaseUser;
    // this.afAuth.authState.subscribe((user)=>{
    //   console.log(JSON.stringify(user));
    //   if(!user)
    //     this.logout();
    // });
    // if(this.firebaseUser != null)
    // this.toastrService.warning('Warning','This is cache login, some features will not working.', {duration:5000});
  }

  /*
    01 Mar 2023 wutthichair
      Revise canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.firebaseUser == null) {
      this.router.navigate(["./authentication/"]);
      return false;
    }

    return true;
  }

  /*
    01 Mar 2023 wutthichair
      Add GoogleAuth()
  */
  public GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  public async AnynomousAuth(email: string) {
    return this.afAuth.signInAnonymously().then((result) => {
      const tempFirebaseUser: FirebaseUser = {
        uid: result.user.uid,
        email: email,
        emailVerified: false,
        displayName: "",
        isAnonymous: true,
        photoURL: "",
        createdAt: "",
        lastLoginAt: "",
        apiKey: "",
        appName: "",
      };

      // console.log('login result: ' + JSON.stringify(tempFirebaseUser));
      this.saveDataWithExpiry(
        this.firebaseUserStoreKey,
        JSON.stringify(tempFirebaseUser),
        2 * 365 * 24 * 60 * 60 * 1000
      );
      this.firebaseUser = tempFirebaseUser;
    });
  }

  /*
    01 Mar 2023 wutthichair
      Add AuthLogin()
  */
  private async AuthLogin(
    provider: firebase.default.auth.AuthProvider | GoogleAuthProvider
  ) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        /*
          02 Mar 2023 wutthichair
            Implement function check airasia domain
        */
        const tempFirebaseUser = JSON.parse(
          JSON.stringify(result.user)
        ) as FirebaseUser;

        if (!tempFirebaseUser.email.includes("@airasia.com")) {
          /*
            02 Mar 2023 wutthichair
              inhibit check airasia.com domain
          */
          if (settings.onlyAirasiaLogin)
            throw new Error("Invalid Airasia Email");
        }

        /*
          01 Mar 2023 wutthichair
            Implement function when get result from firebase
        */
        this.saveDataWithExpiry(
          this.firebaseUserStoreKey,
          JSON.stringify(tempFirebaseUser),
          2 * 365 * 24 * 60 * 60 * 1000
        );
        this.firebaseUser = tempFirebaseUser;
        this.router.navigate(["./authorization/role"]);
      })
      .catch((error) => {
        this.logout();
        throw new Error(error);
      });
  }

  /*
    01 Mar 2023 wutthichair
      Add saveDataWithExpiry(key : string, value: string, ttl : number)
  */
  private saveDataWithExpiry(key: string, value: string, ttl: number) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };

    localStorage.setItem(key, JSON.stringify(item));
  }

  /*
    01 Mar 2023 wutthichair
      Add getDataWithExpiry(key : string)
  */
  private getDataWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  }

  /*
    01 Mar 2023 wutthichair
      Add getFirebaseUser()
  */
  public getFirebaseUser(): FirebaseUser {
    return this.firebaseUser;
  }

  /*
    01 Mar 2023 wutthichair
      Add logout()
  */
  public logout() {
    //Remove firebaseUser from local storage
    localStorage.removeItem(this.firebaseUserStoreKey);

    this.afAuth.signOut().then(() => {
      this.router.navigate(["./authentication/"]);
    });
  }
}
