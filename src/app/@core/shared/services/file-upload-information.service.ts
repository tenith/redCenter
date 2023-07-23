import { Injectable } from '@angular/core';
import { FileUploadInformation } from '../interfaces/file-upload-information';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { FirestoreUserService } from './firestore-user.service';

import  firestore  from 'firebase/compat/app';

import { firestoreCollection, requiredVerify } from '../../../../environments/myconfigs';

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

  public async reloadData(): Promise<any> {
    const ref = this.collectionRef.doc(this.email).ref;
    ref.get()
    .then((docSnapshot)=>{
      if(!docSnapshot.exists){
        this.collectionRef.doc(this.email).set({files: [], needVerify: false});
      }
      else{
        this.fileUploadInformations = [...docSnapshot.data().files] as FileUploadInformation[];
        let needVerify = false;
        for(let i=0;i<this.fileUploadInformations.length;i++){
          if(this.fileUploadInformations[i].verify == undefined){
            const thisVerify = requiredVerify[this.firestoreUser.getFirestoreUser().role].includes(this.fileUploadInformations[i].fileCategory);
            this.removeFileUploadInformation(this.fileUploadInformations[i], this.email);
            this.fileUploadInformations[i].verify = !thisVerify;
            needVerify = needVerify || thisVerify;
            this.addFileUploadInformation(this.fileUploadInformations[i],this.email);
          }
          if(this.fileUploadInformations[i].verify == false){
            needVerify = true;
            break;
          }
        }

        if(docSnapshot.data().needVerify == undefined)
          this.setNeedVerify(this.email,needVerify);
        else
          if(docSnapshot.data().needVerify != needVerify)
            this.setNeedVerify(this.email,needVerify);
      }
    });
  }

  public checkVerifyNeed(email: string): void {
    const ref = this.collectionRef.doc(email).ref;
    ref.get()
    .then((docSnapshot)=>{
      if(docSnapshot.exists){
        const temp = [...docSnapshot.data().files] as FileUploadInformation[];
        let needVerify = false;
        for(let i=0;i<temp.length;i++){
          if(temp[i].verify == undefined)
            continue;
          if(temp[i].verify == false){
            needVerify = true;
            break;
          }
        }
        this.setNeedVerify(email, needVerify);
      }
    });
  }

  private init(): void{
    this.reloadData();
    this.sub();
  }

  private sub(): void {
    this.collectionRef.doc(this.email).valueChanges().subscribe(()=>{
      this.reloadData();
    })
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

  public setNeedVerify(email: string, result: boolean): Promise<any>{    
    return this.collectionRef.doc(email).ref.update({needVerify:result});
  }

  public async removeFileUploadByName(name: string, email: string): Promise<any>{
    let tempFileInformation: FileUploadInformation;   

    for(let i=0;i<this.fileUploadInformations.length;i++){
      if(this.fileUploadInformations[i].name == name){
        tempFileInformation = this.fileUploadInformations[i];
        break;
      }
    }   

    return this.collectionRef.doc(email).ref.update({files:firestore.firestore.FieldValue.arrayRemove(tempFileInformation)});
  }

  public removeFileUploadInformation(fileUploadInformation: FileUploadInformation, email: string): Promise<any>{
    // console.log('delete Upload FILE INFO: ' + JSON.stringify(fileUploadInformation));
    return this.collectionRef.doc(email).ref.update({files:firestore.firestore.FieldValue.arrayRemove(fileUploadInformation)});
  }
}
