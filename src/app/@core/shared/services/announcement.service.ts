import { Injectable } from '@angular/core';
import { Announcement } from '../interfaces/announcement';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FirestoreUserService } from './firestore-user.service';
import { Signature } from '../interfaces/signature';

import  firestore  from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient, HttpParams } from '@angular/common/http';

import { firestoreCollection } from '../../../../environments/myconfigs';
import { API } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  collectionName: string = firestoreCollection.announcementCollectionName;
  collectionRef: AngularFirestoreCollection<Announcement>;
  announcements: Observable<Announcement[]>;

  private cloudFunctionAnnouncement = API.cloudFunctionAnnouncement;
  cacheAnnouncement: Announcement[]; 

  constructor(private httpClient:HttpClient, private afs: AngularFirestore, private firestoreUser: FirestoreUserService) { 
    this.collectionRef = this.afs.collection(this.collectionName, ref=> ref.where('audience','array-contains',this.firestoreUser.getFirestoreUser().role));
    this.announcements = this.collectionRef.snapshotChanges().pipe(map(
      actions => actions.map(
        a => {
          const announcement = a.payload.doc.data() as Announcement;
          return {...announcement} as Announcement;
        }
      )));
  }

  makeAnnouncement(id: string): Promise<any>{
    let params = new HttpParams().set('announcementsID', id).set('timeStamp', new Date().valueOf());
    return this.httpClient.get(this.cloudFunctionAnnouncement, {params:params, responseType:'text'}).toPromise();
  }
  
  addAnnouncement(announcement: Announcement): Promise<any>{
    return this.collectionRef.doc(encodeURIComponent(announcement.code)).set(announcement);
  }

  setAnnouncementInCache(announcements: Announcement[]){
    this.cacheAnnouncement = announcements;
  }

  getAnnouncementFromCache(code: string): Announcement{
    if(!this.cacheAnnouncement)
      return null;
    
    const tempIndex = this.cacheAnnouncement.findIndex(object=> { return encodeURIComponent(object.code) === code});
    if(tempIndex>=0)
      return this.cacheAnnouncement[tempIndex];
    else  
      return null;
  }

  getAnnouncementsWithPagination(pageSize: number, currentPage: number): Observable<any[]> {
    const items = this.afs.collection(this.collectionName, ref=> {
      return ref.where('audience','array-contains',this.firestoreUser.getFirestoreUser().role)
      .limit(pageSize).startAt(currentPage * pageSize);
    });

    return items.valueChanges();
  }

  getAnnouncement(code: string): Promise<any>{
    return this.collectionRef.doc(code).ref.get();
  }

  getAllAnnouncements(): Observable<Announcement[]>{
    return this.announcements;
  }

  updateDateAnnouncement(announcement: Announcement): Promise<any>{
    return this.collectionRef.doc(encodeURIComponent(announcement.code)).update(announcement);
  }

  addAcknowledgement(code: string, signature: Signature): Promise<any>{
    return this.collectionRef.doc(code).ref.update({signatures:firestore.firestore.FieldValue.arrayUnion(signature)});
  }

  deleteAnnouncement(uuid: string): Promise<any>{
    return this.collectionRef.doc(uuid).delete();
  }
}
