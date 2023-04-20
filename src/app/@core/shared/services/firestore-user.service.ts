import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FirebaseUser } from '../interfaces/firebase-user';
import { FirestoreUser } from '../interfaces/firestore-user';
import { FirebaseAuthenticationService } from './firebase-authentication.service';

// import * as admin from 'firebase-admin';
import  firestore  from 'firebase/compat/app';
import { Invoice } from '../interfaces/invoice';

@Injectable({
  providedIn: 'root'
})
export class FirestoreUserService {
  collectionName: string = '/users';
  token: string = '';

  canCreateFlag: boolean = false;
  canDeleteFlag: boolean = false;

  public isModerator: boolean = false;
  public isAdmin: boolean = false;

  firestoreUser: FirestoreUser;
  firestoreUserDBName: string = 'firestoreUserDBName';

  collectionRef: AngularFirestoreCollection<FirestoreUser>;
  // firestoreUser: FirestoreUser;

  constructor(public afs: AngularFirestore, public firebaseAuthen: FirebaseAuthenticationService) { 
    this.collectionRef = this.afs.collection(this.collectionName);

    /**
     * user has been login into system and cache has data.
     */
    if(localStorage.getItem(this.firestoreUserDBName) != null){
      this.firestoreUser = JSON.parse(localStorage.getItem(this.firestoreUserDBName)) as FirestoreUser;
      this.reviseAuthorization();
    }
  }

  public getFirestoreUser(): FirestoreUser{
    return this.firestoreUser;
  }

  public setFirestoreUser(firestoreUser: FirestoreUser): void {
    this.firestoreUser = firestoreUser;
    localStorage.setItem(this.firestoreUserDBName,JSON.stringify(this.firestoreUser));

    this.reviseAuthorization();
  }

  public reviseAuthorization(): void{
    if(this.firestoreUser.level == 'Admin' || this.firestoreUser.level == 'Moderator')
      this.canCreateFlag = true;

    if(this.firestoreUser.level == 'Admin')
      this.canDeleteFlag = true;

    if(this.firestoreUser.level == 'Moderator')
      this.isModerator = true;

    if(this.firestoreUser.level == 'Admin')
      this.isAdmin = true;
  }

  public canCreate(): boolean{
    return this.canCreateFlag;
  }

  public canDelete(): boolean{
    return this.canDeleteFlag;
  }

  public getFirestoreUserFromServer(): Promise<any> {
    return this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).ref.get();
  }

  public isAcknowledge(code: string): number{
    const acknowledgeList = this.firestoreUser.invoice as Invoice[];
    const tempIndex = acknowledgeList.findIndex(object => { return object.uuid === encodeURIComponent(code)});
    
    return tempIndex;
  }

  public getInvoice(index: number): Invoice{
    const acknowledgeList = this.firestoreUser.invoice as Invoice[];
    return acknowledgeList[index];
  }

  public initDefaultFirestoreUser(): Promise<any> {
    let tempUser: FirebaseUser = this.firebaseAuthen.getFirebaseUser();
    let tempDeafult: FirestoreUser = {
      email: tempUser.email,
      aoc: '',
      role: '',
      level: 'Subscriber',
      displayName: tempUser.displayName,
      photoURL: tempUser.photoURL,
      tokenList: [],
      invoice: [],
    };

    this.firestoreUser = tempDeafult;
    // console.log('init default firestoreuser :' + JSON.stringify(this.firestoreUser));
    localStorage.setItem(this.firestoreUserDBName,JSON.stringify(this.firestoreUser));
    return this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).set(tempDeafult);
  }

  public getFirestoreUserByEmail(email: string) : Promise<any> {
    return this.collectionRef.doc(email).ref.get();
  }

  public reviseFirestoreUser(firestoreUser: FirestoreUser): Promise<any> {
    return this.collectionRef.doc(firestoreUser.email).update({role: firestoreUser.role, level: firestoreUser.level, aoc:firestoreUser.aoc});
  }

  public addAcknowledgement(firestoreUser: FirestoreUser, invoice: Invoice): Promise<any>{
    return this.collectionRef.doc(firestoreUser.email).ref.update({invoice:firestore.firestore.FieldValue.arrayUnion(invoice)});
  }

  public hasRole(): boolean{
    // console.log(JSON.stringify(this.firestoreUser));
    if(this.firestoreUser == null || this.firestoreUser == undefined)
      return false;
    if(this.firestoreUser.role == null)
      return false;
    if(this.firestoreUser.role != '')
      return true;
    
    return false;
  }

  setRole(role: string): void{
    this.firestoreUser.role = role;
    localStorage.setItem(this.firestoreUserDBName,JSON.stringify(this.firestoreUser));
    this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).update({role: role})
        .then(()=> {
          console.log('Set role :' + role + ' completed');
        })
        .catch(err => {
          console.log('Set Role Error', err);
        });
  }

  setInitialUser(aoc: string, role:string): Promise<any> {
    this.firestoreUser.role = role;
    this.firestoreUser.aoc = aoc;
    // console.log('object before update' + JSON.stringify(this.firestoreUser));
    // console.log(this.firestoreUser.role);
    // console.log(this.firestoreUser.aoc);
    return this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).update({role: this.firestoreUser.role, aoc:this.firestoreUser.aoc});
  }

  addToken(token: string): void{
    this.token = token;    

    /**
     * logic array union
     */
    this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).ref.update({
      tokenList: firestore.firestore.FieldValue.arrayUnion(token)}).then(()=> {
        // console.log('Update Token array union:' + token + ' completed');
      })
      .catch(error => {
        // console.log('Update Token array union:' + token + ' error' + error);
      });

    const roleCollection: AngularFirestoreCollection<any> = this.afs.collection('groupTokenList');

    roleCollection.doc(this.firestoreUser.aoc).collection(this.firestoreUser.role).doc('tokenDocument').ref.update({
        tokenList: firestore.firestore.FieldValue.arrayUnion(token)}).then(()=> {
          // console.log('Update Token array union:' + token + ' to group ' + this.firestoreUser.role + ' completed');
        })
        .catch(error => {
          // console.log('Update Token array union:' + token + ' error' + error);
        });
  }

  async deleteToken(): Promise<any>{    
    await this.collectionRef.doc(this.firebaseAuthen.getFirebaseUser().email).ref.update({
      tokenList: firestore.firestore.FieldValue.arrayRemove(this.token)}).then(()=> {
        // console.log('x Token array remove:' + this.token + ' completed');
      })
      .catch(error => {
        // console.log('x Token array remove:' + this.token + ' error' + error);
      });

    const roleCollection: AngularFirestoreCollection<any> = this.afs.collection('groupTokenList');
    await roleCollection.doc(this.firestoreUser.aoc).collection(this.firestoreUser.role).doc('tokenDocument').ref.update({
        tokenList: firestore.firestore.FieldValue.arrayRemove(this.token)}).then(()=> {
          // console.log('Update Token array union:' + this.token + ' to group ' + this.firestoreUser.role + ' completed');
        })
        .catch(error => {
          // console.log('Update Token array union:' + this.token + ' error' + error);
        });
  }

  deleteFirestoreUser(firestoreUser: FirestoreUser): Promise<any>{
    return this.collectionRef.doc(firestoreUser.email).delete();
    // .then(()=> {
    //     console.log('Delete ' + this.firebaseAuthen.getFirebaseUser().email + ' completed.');
    //   })
    //   .catch(error=> {
    //     console.log(error);
    //   });
  }

  logout(): void{
    localStorage.removeItem(this.firestoreUserDBName);
    this.firestoreUser = null;
  }
}
