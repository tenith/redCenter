import { Injectable } from "@angular/core";
import {
  localStorageCollection,
  sepCourseDisplayOptions,
  sepCourseOptions,
} from "../../../../environments/myconfigs";
import { FirestoreUserService } from "./firestore-user.service";
import { OneSepCard } from "../interfaces/one-sep-card";

@Injectable({
  providedIn: "root",
})
export class SepHistoicalService {
  sepHistoricalDBName: string =
    localStorageCollection.sepHistoricalCollectionName;
  fullHistory: { [key: string]: OneSepCard[] } = {};

  constructor(private firestoreUser: FirestoreUserService) {
    const temp = localStorage.getItem(this.sepHistoricalDBName);
    if (temp != null) this.fullHistory = JSON.parse(temp);
  }

  public addHistorical(courseName: string, oneSepCards: OneSepCard[]) {
    this.fullHistory[courseName] = oneSepCards;
    this.save();
  }

  public getHistorical(courseName: string): OneSepCard[] {
    if (courseName in this.fullHistory) return this.fullHistory[courseName];
    else return [];
  }

  public save(): void {
    localStorage.setItem(
      this.sepHistoricalDBName,
      JSON.stringify(this.fullHistory),
    );
  }

  public deleteSEPHistorical(): void {
    localStorage.removeItem(this.sepHistoricalDBName);
  }
}
