import { Injectable } from '@angular/core';
import { firestoreCollection } from '../../../../environments/myconfigs';
import { ETS1Data } from '../interfaces/e-ts1-data';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, combineLatest } from 'rxjs';
import { FirestoreUserService } from './firestore-user.service';
import { map } from 'rxjs/operators';
import { cleanETS1Data } from '../data/cleanETS1Data';

@Injectable({
  providedIn: 'root'
})
export class ETS1Service {
  collectionName: string = firestoreCollection.eTS1CollectionName;
  collectionRef: AngularFirestoreCollection<ETS1Data>;
  eTS1List: Observable<ETS1Data[]>;

  eTS1ListCache: ETS1Data[] = [];  

  constructor(private afs: AngularFirestore, private firestoreUser: FirestoreUserService) {     
    // const query1 = this.afs.collection(this.collectionName).ref.where('ownerEmail','==',this.firestoreUser.getFirestoreUser().email);
    // const query2 = this.afs.collection(this.collectionName).ref.where('submitDateTime','!=','');
    // query1.or.where

    // if(this.firestoreUser.isAdmin || this.firestoreUser.isModerator)
    //   this.collectionRef = this.afs.collection(this.collectionName, ref => ref.where('ownerEmail','==',this.firestoreUser.getFirestoreUser().email));  
    // else

    const isMySession = this.afs.collection(this.collectionName, ref => ref.where('staffNo1','==',this.firestoreUser.getFirestoreUser().cId));
    const isMine = this.afs.collection(this.collectionName, ref => ref.where('ownerEmail','==',this.firestoreUser.getFirestoreUser().email));
    const isSubmit = this.afs.collection(this.collectionName, ref => ref.where('submitDateTime','!=',''));

    let isMineObservable: Observable<ETS1Data[]> = isMine.snapshotChanges().pipe(map(
      actions => actions.map(
        a => {
          const eTS1 = a.payload.doc.data() as ETS1Data;
          return {...eTS1} as ETS1Data;
        }
      )));;

    let isMySessionObservable: Observable<ETS1Data[]> = isMySession.snapshotChanges().pipe(map(
      actions => actions.map(
        a => {
          const eTS1 = a.payload.doc.data() as ETS1Data;
          return {...eTS1} as ETS1Data;
        }
      )));;

    isMineObservable = combineLatest([isMineObservable,isMySessionObservable]).pipe(
      map(([data1,data2])=> { 
        // Concatenate the arrays and remove duplicates
        const mergedData = data1.concat(data2);
        const uniqueData = mergedData.filter((value, index, self) => {
          return self.findIndex((v) => v.uuid === value.uuid) === index;
        });
        return uniqueData;
        // return data1.concat(data2);
      })
    );
    

    if(this.firestoreUser.isAdmin || this.firestoreUser.isModerator){
      let isSubmitObservable: Observable<ETS1Data[]> = isSubmit.snapshotChanges().pipe(map(
        actions => actions.map(
          a => {
            const eTS1 = a.payload.doc.data() as ETS1Data;
            return {...eTS1} as ETS1Data;
          }
        )));;

      const totalObservable = combineLatest([isMineObservable,isSubmitObservable]).pipe(
        map(([data1,data2])=> { 
          // Concatenate the arrays and remove duplicates
          const mergedData = data1.concat(data2);
          const uniqueData = mergedData.filter((value, index, self) => {
            return self.findIndex((v) => v.uuid === value.uuid) === index;
          });
          return uniqueData;
          // return data1.concat(data2);
        })
      );
      this.eTS1List = totalObservable;
    }
    else{      
      this.eTS1List = isMineObservable;
    }        
      
    this.collectionRef = this.afs.collection(this.collectionName, ref => ref.where('ownerEmail','==',this.firestoreUser.getFirestoreUser().email));
  }

  neweTS1(uuid: string): Promise<any>{
    let tempETS1: ETS1Data = cleanETS1Data;
    tempETS1.uuid = uuid;
    tempETS1.ownerEmail = this.firestoreUser.getFirestoreUser().email;
    
    this.addeTS1InCache(tempETS1);
    
    return this.addeTS1(tempETS1);
  }

  addeTS1(eTS1: ETS1Data): Promise<any>{
    return this.collectionRef.doc(eTS1.uuid).set(eTS1);
  }

  addeTS1InCache(eTS1: ETS1Data){
    this.eTS1ListCache.push(eTS1);
  }  

  seteTS1InCache(eTS1: ETS1Data[]){
    this.eTS1ListCache = eTS1;
  }

  geteTS1FromCache(): ETS1Data[]{
    return this.eTS1ListCache;
  }

  geteTS1FromCacheByUUID(uuid: string): ETS1Data {
    let temp: ETS1Data;
    for(let i=0;i<this.eTS1ListCache.length;i++){
      if(this.eTS1ListCache[i].uuid == uuid)
        temp = this.eTS1ListCache[i];
    }
    return temp;
  }

  geteTS1byUUID(uuid: string): Promise<any>{
    return this.collectionRef.doc(uuid).ref.get();
  }

  getAlleTS1(): Observable<ETS1Data[]>{
    return this.eTS1List;
  }

  updateDateeTS1(eTS1: ETS1Data): Promise<void>{
    return this.collectionRef.doc(eTS1.uuid).set(eTS1);
  }

  deleteeTS1(uuid: string): Promise<any>{
    return this.collectionRef.doc(uuid).delete();
  }
}
