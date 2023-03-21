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

  collectionRef: AngularFirestoreCollection<FirestoreUser>;
  // firestoreUser: FirestoreUser;

  constructor(public afs: AngularFirestore, public firebaseAuthen: FirebaseAuthenticationService) { 
    this.collectionRef = this.afs.collection(this.collectionName);
    this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).ref.get().then((doc)=> {
      if (doc.exists) 
        console.log('SET UP completed');
      else 
        this.initFirestoreUser();
    }).catch((error)=> { console.log(error);});
  }

  //Create FirestoreUser....
  public initFirestoreUser(): void{
    let tempUser: FirebaseUser = this.firebaseAuthen.getFirebaseUser();
    let tempDeafult: FirestoreUser = {
      email: tempUser.email,
      displayName: tempUser.displayName,
      photoURL: tempUser.photoURL,
      tokenList: []
    }
    this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).set(tempDeafult)
    .then(()=> {
      this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).ref.get().then((doc)=> {
        if (doc.exists) 
          console.log('SET UP completed');
      })
    })
    .catch(error=> {
      console.log(error);
    });
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
