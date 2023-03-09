import { Injectable } from '@angular/core';
/*
  01 Mar 2023 wutthichair
    Import required modules
*/
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { GoogleAuthProvider } from 'firebase/auth';
import { FirebaseUser } from '../interfaces/firebase-user';
/*
  01 Mar 2023 wutthichair
    Import required modules
*/

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService implements CanActivate{

  /*
    01 Mar 2023 wutthichair
  */
  private firebaseUser: FirebaseUser;
  private firebaseUserStoreKey = "firebaseUserStoreKey";

  /*
    01 Mar 2023 wutthichair
      Revise constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public router: Router)
  */
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, private toastrService: NbToastrService, public router: Router) {
    this.firebaseUser = JSON.parse(this.getDataWithExpiry(this.firebaseUserStoreKey)) as FirebaseUser;
    if(this.firebaseUser != null){
      console.log('Cache Login');
    }
  }

  /*
    01 Mar 2023 wutthichair
      Revise canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if(this.firebaseUser == null){
      this.router.navigate(['./authentication/']);
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

  /*
    01 Mar 2023 wutthichair
      Add AuthLogin()
  */
  private async AuthLogin(provider: firebase.default.auth.AuthProvider | GoogleAuthProvider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        /*
          02 Mar 2023 wutthichair
            Implement function check airasia domain
        */
        const tempFirebaseUser  = JSON.parse(JSON.stringify(result.user)) as FirebaseUser;
        
        if(!tempFirebaseUser.email.includes("@airasia.com")){
          /*
            02 Mar 2023 wutthichair
              inhibit check airasia.com domain
          */
          // throw new Error('Invalid Airasia Email');
        }

        /*
          01 Mar 2023 wutthichair
            Implement function when get result from firebase
        */
        this.saveDataWithExpiry(this.firebaseUserStoreKey,JSON.stringify(tempFirebaseUser),2*365*24*60*60*1000);
        this.firebaseUser = tempFirebaseUser;
        this.router.navigate(['./pages']);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  /*
    01 Mar 2023 wutthichair
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
    01 Mar 2023 wutthichair
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
    01 Mar 2023 wutthichair
      Add getFirebaseUser()
  */
  public getFirebaseUser(): FirebaseUser{
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
      this.router.navigate(['./authentication/']);
    });
  }
}