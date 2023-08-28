import { Injectable } from "@angular/core";
import { FileUploadInformation } from "../interfaces/file-upload-information";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { FirestoreUserService } from "./firestore-user.service";
import { firestoreCollection } from "../../../../environments/myconfigs";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import firestore from "firebase/compat/app";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class FileVerificationHistoryService {
  collectionName: string = firestoreCollection.fileUploadHistoryCollectionName;
  collectionRef: AngularFirestoreCollection<any>;

  isModerator: boolean = false;
  fileUploadInformations: FileUploadInformation[] = [];

  allList: Observable<any>;

  constructor(
    private afs: AngularFirestore,
    private firestoreUser: FirestoreUserService
  ) {
    this.collectionRef = this.afs.collection(this.collectionName);
    this.isModerator = this.firestoreUser.isModerator;

    const todayDate = new DatePipe("en-US").transform(
      new Date(),
      "dd MMM yyyy"
    );

    const ref = this.collectionRef.doc(todayDate).ref;
    ref.get().then((docSnapshot) => {
      if (!docSnapshot.exists) {
        this.collectionRef.doc(todayDate).set({ files: [] });
      }
    });
  }

  public async addHistory(
    fileUploadInformation: FileUploadInformation,
    formattedDate: string
  ): Promise<any> {
    return this.collectionRef.doc(formattedDate).ref.update({
      files: firestore.firestore.FieldValue.arrayUnion(fileUploadInformation),
    });
  }

  getHistoryOn(formattedDate: string): Observable<any> {
    const dateDoc = this.afs.collection(this.collectionName).doc(formattedDate);
    return dateDoc.valueChanges();
  }

  getAllList(): Observable<any> {
    if (this.allList != undefined) return this.allList;

    const allList = this.afs.collection(this.collectionName);
    this.allList = allList.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const fileNeedVerify = a.payload.doc.data();
          return fileNeedVerify;
        })
      )
    );

    return this.allList;
  }
}
