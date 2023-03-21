import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { FirebaseUser } from '../interfaces/firebase-user';
import { FirestoreUser } from '../interfaces/firestore-user';
import { FirebaseAuthenticationService } from './firebase-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreUserService {
  collectionName: string = '/users';
  token: string = '';

  firestoreUser: FirestoreUser;
  firestoreUserDBName: string = 'firestoreUserDBName';

  collectionRef: AngularFirestoreCollection<FirestoreUser>;
  // firestoreUser: FirestoreUser;

  constructor(public afs: AngularFirestore, public firebaseAuthen: FirebaseAuthenticationService) { 
    if(localStorage.getItem(this.firestoreUserDBName) != null)
      this.firestoreUser = JSON.parse(localStorage.getItem(this.firestoreUserDBName)) as FirestoreUser;

    this.collectionRef = this.afs.collection(this.collectionName);
    this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).ref.get().then((doc)=> {
      if (doc.exists) {
        this.firestoreUser = {...doc.data()} as FirestoreUser;
      }
      else 
        this.initFirestoreUser();
    }).catch((error)=> { console.log(error);});
  }

  
  async getRole(): Promise<string>{
    return this.firestoreUser.role;
  }

  public isInLocalStorage(): boolean{
    return localStorage.getItem(this.firestoreUserDBName) != null;
  }

  public getFirestoreUser(): Promise<any> {
    return this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).ref.get();
  }

  async createFirestoreUser(): Promise<any>{
    let tempUser: FirebaseUser = this.firebaseAuthen.getFirebaseUser();
    let tempDeafult: FirestoreUser = {
      email: tempUser.email,
      role: '',
      displayName: tempUser.displayName,
      photoURL: tempUser.photoURL,
      tokenList: []
    };
    this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).set(tempDeafult)
      .then(()=> {return tempDeafult})
      .catch(error=> {
        console.log(error);
      });
  }

  //Create FirestoreUser....
  public initFirestoreUser(): void{
    let tempUser: FirebaseUser = this.firebaseAuthen.getFirebaseUser();
    let tempDeafult: FirestoreUser = {
      email: tempUser.email,
      role: '',
      displayName: tempUser.displayName,
      photoURL: tempUser.photoURL,
      tokenList: []
    };
    this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).set(tempDeafult)
    .then(()=> {
      this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).ref.get().then((doc)=> {
        if (doc.exists) {
          console.log('SET UP completed');
          this.firestoreUser = tempDeafult;
          localStorage.setItem(this.firestoreUserDBName,JSON.stringify(this.firestoreUser));
        }
      })
    })
    .catch(error=> {
      console.log(error);
    });
  }

  public hasRole(): boolean{
    // console.log('object firestore : ' + JSON.stringify(this.firestoreUser));
    if(this.firestoreUser == null || this.firestoreUser == undefined)
      return false;
    if(this.firestoreUser.role == null)
      return false;
    if(this.firestoreUser.role != '')
      return true;
    
    return false;
  }

  initRole(role: string): void{
    this.firestoreUser = {...this.firestoreUser, role : role} as FirestoreUser;
    this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).ref.get().then((doc)=> {
      if (doc.exists) {
        let temp = {...doc.data()} as FirestoreUser;
        temp.role = role;
        this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).update({role: role})
        .then(()=> {
          console.log('Init role :' + role + ' completed');
          localStorage.setItem(this.firestoreUserDBName,JSON.stringify(this.firestoreUser));
        });
      }
    }).catch((error)=> { console.log(error);});
  }

  addToken(token: string): void{
    this.token = token;
    this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).ref.get().then((doc)=> {
      if (doc.exists) {
        let temp = {...doc.data()} as FirestoreUser;
        let tempIndex = temp.tokenList.indexOf(token);
        if(tempIndex >= 0)
          return;
        temp.tokenList.push(token);

        this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).update({tokenList: temp.tokenList})
        .then(()=> {
          console.log('Update Token :' + token + ' completed');
        });
      }
    }).catch((error)=> { console.log(error);});
  }

  deleteToken(): void{
    this.firestoreUser = null;
    localStorage.removeItem(this.firestoreUserDBName);
    this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).ref.get().then((doc)=> {
      if (doc.exists) {
        let temp = {...doc.data()} as FirestoreUser;
        let tempIndex = temp.tokenList.indexOf(this.token);
        if(tempIndex < 0)
          return;
        temp.tokenList.splice(tempIndex,1);

        this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).update({tokenList: temp.tokenList})
        .then(()=> {
          console.log('Remove Token :' + this.token + ' completed');
        });
      }
    }).catch((error)=> { console.log(error);});
  }

  deleteFirestoreUser(): void{
    this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).delete().then(()=> {
        console.log('Delete ' + this.firebaseAuthen.getFirebaseUser().email + ' completed.');
      })
      .catch(error=> {
        console.log(error);
      });
  }
}
