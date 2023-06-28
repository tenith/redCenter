import { Injectable } from '@angular/core';
import { FileUploadInformation } from '../interfaces/file-upload-information';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { FirestoreUserService } from './firestore-user.service';

import  firestore  from 'firebase/compat/app';

import { firestoreCollection } from '../../../../environments/myconfigs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadInformationService {
  collectionName: string = firestoreCollection.fileUploadCollectionName;
  collectionRef: AngularFirestoreCollection<any>;

  isModerator: boolean = false;
  email: string = '';
  fileUploadInformations: FileUploadInformation[] = [];

  constructor(private afs: AngularFirestore, private firestoreUser: FirestoreUserService) { 
    this.collectionRef = this.afs.collection(this.collectionName);
    this.isModerator = this.firestoreUser.isModerator;
    this.email = this.firestoreUser.getFirestoreUser().email;
    this.init();
  }

  public getFileUploadInformationSnapshotByEmail(email: string): DocumentReference<any> {
    return this.collectionRef.doc(email).ref;
  }

  public getFileUploadInformationSnapshot(): DocumentReference<any> {
    return this.collectionRef.doc(this.email).ref;
  }

  public getMyFileUploadInformation(): FileUploadInformation[]{
    return this.fileUploadInformations;
  }

  private init(): void{
    const ref = this.collectionRef.doc(this.email).ref;
    ref.get()
    .then((docSnapshot)=>{
      if(!docSnapshot.exists){
        this.collectionRef.doc(this.email).set({files: []});
      }
      else{
        this.fileUploadInformations = [...docSnapshot.data().files] as FileUploadInformation[];
        // console.log(JSON.stringify(this.fileUploadInformations));
      }
    });
  }

  public getFileUploadInformation(email: string): Promise<any>{
    const newRef = this.afs.collection(this.collectionName).doc(email).ref;
    if(newRef == null || newRef == undefined)
      return null;
    return newRef.get();
  }

  public async addFileUploadInformation(fileUploadInformation: FileUploadInformation, email: string): Promise<any>{    
    return this.collectionRef.doc(email).ref.update({files:firestore.firestore.FieldValue.arrayUnion(fileUploadInformation)});
  }

  public removeFileUploadByName(name: string, email: string): Promise<any>{
    let tempFileInformation: FileUploadInformation;
    for(let i=0;i<this.fileUploadInformations.length;i++){
      if(this.fileUploadInformations[i].name == name)
        tempFileInformation = this.fileUploadInformations[i];
    }
    return this.collectionRef.doc(email).ref.update({files:firestore.firestore.FieldValue.arrayRemove(tempFileInformation)});
  }

  public removeFileUploadInformation(fileUploadInformation: FileUploadInformation, email: string): Promise<any>{
    // console.log('delete Upload FILE INFO: ' + JSON.stringify(fileUploadInformation));
    return this.collectionRef.doc(email).ref.update({files:firestore.firestore.FieldValue.arrayRemove(fileUploadInformation)});
  }
}
