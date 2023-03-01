import { Injectable } from '@angular/core';
/*
  01 Mar 2023 wutthichair
    Import AngularFireAuth, AngularFirestore, Router, GoogleAuthProvider and FirebaseUser
*/
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { FirebaseUser } from '../interfaces/firebase-user';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService implements CanActivate{

  private firebaseUserInfo: FirebaseUser;

  /*
    01 Mar 2023 wutthichai
      Revise constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public router: Router)
  */
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public router: Router) {
  }

  /*
    01 Mar 2023 wutthichai
      Revise canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    return this.firebaseUserInfo != null;
  }

  /*
    01 Mar 2023 wutthichai
      Add GoogleAuth()
  */
  private GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  /*
    01 Mar 2023 wutthichai
      Add AuthLogin()
  */
  private AuthLogin(provider: firebase.default.auth.AuthProvider | GoogleAuthProvider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        //Good Authentication 
        console.log(JSON.stringify(result.user));
      })
      .catch((error) => {
        //Unable to login
        console.log(error);
      });
  }

  /*
    01 Mar 2023 wutthichai
      Add saveDataWithExpiry(key : string, value: string, ttl : number)
  */
  private saveDataWithExpiry(key : string, value: string, ttl : number){
    const now = new Date();

    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };

    localStorage.setItem(key, JSON.stringify(item));
  }

  /*
    01 Mar 2023 wutthichai
      Add getDataWithExpiry(key : string)
  */
  private getDataWithExpiry(key: string){
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  }

  /*
    01 Mar 2023 wutthichai
      Add getFirebaseUser()
  */
  public getFirebaseUser(): FirebaseUser{
    return this.firebaseUserInfo;
  }

  /*
    01 Mar 2023 wutthichai
      Add logout()
  */
  public logout() {
    // localStorage.removeItem(this.emailLocalStorageKey);
    // localStorage.removeItem(this.localDBName);
    // this.loginEmail = '';
    // this.isLoggedIn = false;

    // this.afAuth.signOut().then(() => {
    //   this.router.navigate(['signin']);
    // });
  }
}
