import { Injectable } from '@angular/core';
import { firestoreCollection, httpOptions, localStorageCollection } from '../../../../environments/myconfigs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { VrDetail } from '../interfaces/vr-detail';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import * as uuid from 'uuid';
import { FirestoreUserService } from './firestore-user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { API } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VrService {
  private apiURL = API.vrGoogleService;
  httpOptions = {headers: new HttpHeaders(httpOptions)};

  collectionName: string = firestoreCollection.vrCollectionName;
  collectionRef: AngularFirestoreCollection<VrDetail>;

  vrLocalDBName: string = localStorageCollection.vrLocalDBNameCollectionName;  
  vrList: Observable<VrDetail[]>;  

  constructor(private afs: AngularFirestore, private firestoreUser: FirestoreUserService) { 
    if(this.firestoreUser.isModerator || this.firestoreUser.isAdmin){
      this.collectionRef = this.afs.collection(this.collectionName);
      this.vrList = this.collectionRef.snapshotChanges().pipe(map(
        actions => actions.map(
          a => {
            const doc = a.payload.doc.data() as VrDetail;
            return {...doc} as VrDetail;
          }
        )));
    }
    else{
      this.collectionRef = this.afs.collection(this.collectionName, ref=> ref.where('crewsId','array-contains',this.firestoreUser.getFirestoreUser().cId));
      this.vrList = this.collectionRef.snapshotChanges().pipe(map(
        actions => actions.map(
          a => {
            const doc = a.payload.doc.data() as VrDetail;
            return {...doc} as VrDetail;
          }
        )));
    }
  }   
  
  public getMyVR(): Observable<VrDetail[]> {
    const temp = this.afs.collection(this.collectionName, ref=> ref.where('crewsId','array-contains',this.firestoreUser.getFirestoreUser().cId));
    return temp.snapshotChanges().pipe(map(
        actions => actions.map(
          a => {
            const doc = a.payload.doc.data() as VrDetail;
            return {...doc} as VrDetail;
          }
        )));
  }

  public getAllVR(): Observable<VrDetail[]> {
    return this.vrList;
  }  

  public getVR(uuid: string): Promise<any>{
    return this.collectionRef.doc(uuid).ref.get();
  }

  public deleteVR(uuid: string): Promise<void> {
    return this.collectionRef.doc(uuid).delete();
  }
  
  public saveVR(vr: VrDetail): Promise<any> {
    return this.collectionRef.doc(vr.uuid).set(vr);
  }

  public saveVRwithSubmitTime(vr: VrDetail, formattedDate: string): Promise<any> {
    vr.submitTime = formattedDate;
    return this.collectionRef.doc(vr.uuid).set(vr);
  }

  clearVR(): void {
    
  }
}
