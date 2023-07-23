import { Injectable } from '@angular/core';
import { FileUploadInformation } from '../interfaces/file-upload-information';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { FirestoreUserService } from './firestore-user.service';

import  firestore  from 'firebase/compat/app';

import { firestoreCollection } from '../../../../environments/myconfigs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileVerificationService {
  collectionName: string = firestoreCollection.fileUploadCollectionName;
  collectionRef: AngularFirestoreCollection<any>;

  isModerator: boolean = false;
  fileUploadInformations: FileUploadInformation[] = [];

  needVerifyList: Observable<any>;

  constructor(private afs: AngularFirestore, private firestoreUser: FirestoreUserService) { 
    // this.collectionRef = this.afs.collection(this.collectionName);
    this.isModerator = this.firestoreUser.isModerator;
    
    const needVerify = this.afs.collection(this.collectionName, ref => ref.where('needVerify','==',true));
    this.needVerifyList = needVerify.snapshotChanges().pipe(map(
        actions => actions.map(
          a => {
            const fileNeedVerify = a.payload.doc.data();
            return fileNeedVerify;
          }
        )));;
  } 

  getNeedVerifyList(): Observable<any>{
    return this.needVerifyList;
  }
}
