import { Injectable } from '@angular/core';
import { Announcement } from '../interfaces/announcement';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FirestoreUserService } from './firestore-user.service';
import { Signature } from '../interfaces/signature';

import  firestore  from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  collectionName: string = '/announcements';
  collectionRef: AngularFirestoreCollection<Announcement>;
  announcements: Observable<Announcement[]>;

  constructor(private afs: AngularFirestore, private firestoreUser: FirestoreUserService) { 
    this.collectionRef = this.afs.collection(this.collectionName);
    this.announcements = this.collectionRef.snapshotChanges().pipe(map(
      actions => actions.map(
        a => {
          const announcement = a.payload.doc.data() as Announcement;
          return {...announcement} as Announcement;
        }
      )));
  }
  
  addAnnouncement(announcement: Announcement): Promise<any>{
    return this.collectionRef.doc(encodeURIComponent(announcement.code)).set(announcement);
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
