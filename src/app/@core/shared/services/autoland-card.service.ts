import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import firestore from "firebase/compat/app";

import { of as observableOf, Observable } from "rxjs";
import { AutolandSepCard } from "../interfaces/autoland-sep-card";
import { FirebaseAuthenticationService } from "./firebase-authentication.service";

import {
  firestoreCollection,
  httpOptions,
  roleName,
} from "../../../../environments/myconfigs";
import { localStorageCollection } from "../../../../environments/myconfigs";
import { API } from "../../../../environments/environment";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { FirestoreUserService } from "./firestore-user.service";
import { error } from "console";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class AutolandCardService {
  collectionName: string = firestoreCollection.autoland_online;
  collectionRef: AngularFirestoreCollection<any>;

  private apiURL = API.autolandGoogleSerivce;
  httpOptions = { headers: new HttpHeaders(httpOptions) };

  autoLandCardLocalDBName: string =
    localStorageCollection.autoLandCardCollectionName;
  autoLandCard: AutolandSepCard[];
  email: string;

  constructor(
    private afs: AngularFirestore,
    private firestoreUser: FirestoreUserService,
    public fireBaseAuthService: FirebaseAuthenticationService,
    public httpClient: HttpClient
  ) {
    /*
      13 MAR 2023 wutthichair
        Fetch Data From Server
    */
    // console.log("autoland card service");
    this.email = this.firestoreUser.getFirestoreUser().email;
    this.collectionRef = this.afs.collection(this.collectionName);

    const temp = localStorage.getItem(this.autoLandCardLocalDBName);
    if (temp == null)
      this.autoLandCard = [
        {
          name: "AUTOLAND - ONLINE",
          airport: "",
          perform: "",
          validperiod: "",
          expiry: "",
        },
      ] as AutolandSepCard[];
    else this.autoLandCard = JSON.parse(temp) as AutolandSepCard[];
  }

  isInLocalStorage(): boolean {
    return localStorage.getItem(this.autoLandCardLocalDBName) != null;
  }

  saveAllSepCards(autoLandCard: AutolandSepCard[]): void {
    localStorage.setItem(
      this.autoLandCardLocalDBName,
      JSON.stringify(autoLandCard)
    );
  }

  saveAutolandOnline(autolandCard: AutolandSepCard): void {
    this.autoLandCard[0] = autolandCard;
    this.saveAllSepCards(this.autoLandCard);
  }

  deleteAllSepCards(): void {
    localStorage.removeItem(this.autoLandCardLocalDBName);
  }

  getAutolandCard(name: string): Observable<any> {
    if (name.includes("ONLINE")) return observableOf(this.autoLandCard[0]);
    else return observableOf(this.autoLandCard[1]);
  }

  getAllAutolandCards(): Observable<any> {
    const ref = this.collectionRef.doc(this.email).ref;

    return new Observable<AutolandSepCard>((observer) => {
      const unsub = ref.onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const data = snapshot.data();
          // console.log("GET Data from firestore: " + JSON.stringify(data.info));
          if (data.info.length == 0) observer.next(this.autoLandCard[0]);
          else observer.next(data.info[data.info.length - 1]);
        } else {
          if (this.firestoreUser.getFirestoreUser().role == roleName.pilot) {
            /**
             * ID-0093 Autolanding history was empty when user used automatically update version
             * Add logic to use ref.get() to ensure doc doesn't exists to avoid reset doc....
             */
            ref.get().then((doc) => {
              console.log("ref.get(): " + JSON.stringify(doc.data()));
              if (!doc.exists)
                this.collectionRef.doc(this.email).set({ info: [] });
            });
          }
        }
      });

      return () => unsub();
    });
    // let params = new HttpParams().set(
    //   "email",
    //   this.fireBaseAuthService.getFirebaseUser().email
    // );
    // return this.httpClient.get(this.apiURL, { params: params });
  }

  getAutolandCardFromCache(name: string): AutolandSepCard {
    if (name.includes("ONLINE")) return this.autoLandCard[0];
    else return this.autoLandCard[1];
  }

  getAllAutolandCardsFromCache(): AutolandSepCard[] {
    return this.autoLandCard;
  }

  postAutoLandForm(
    course: string,
    date: string,
    cat: string,
    runway: string,
    airport: string
  ): Observable<any> {
    // var formData: any = new FormData();
    // formData.append("email", this.fireBaseAuthService.getFirebaseUser().email);
    // formData.append("course", course);
    // formData.append("date", date);
    // formData.append("cat", cat);
    // formData.append("runway", runway);
    // formData.append("airport", airport);
    let tempExpiry = "";
    if (date == "") tempExpiry = "";
    else tempExpiry = this.addSixMonthsToDate(new Date(date));

    let autolandRecord: AutolandSepCard = {
      name: course,
      airport: "ILS " + cat + " " + runway + " " + airport,
      perform: new DatePipe("en-US").transform(date, "dd MMM yyyy"),
      validperiod: "6 MONTHS",
      expiry: tempExpiry,
    };

    return new Observable<any>((observer) => {
      // Add the data to Firestore
      this.collectionRef
        .doc(this.email)
        .ref.update({
          info: firestore.firestore.FieldValue.arrayUnion(autolandRecord),
        })
        .then((result) => {
          observer.next({
            status: "completed",
            detail: "add information completed",
          });
          observer.complete();
        })
        .catch();
    });

    // return this.httpClient.post(this.apiURL, formData);
  }

  addSixMonthsToDate(inputDate: Date): string {
    let newDate = new Date(inputDate);
    newDate.setMonth(newDate.getMonth() + 7);

    // Set the date to the last day of the month if necessary
    newDate.setDate(0);

    return new DatePipe("en-US").transform(newDate, "dd MMM yyyy");
  }
}
