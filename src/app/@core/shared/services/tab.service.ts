import { Injectable } from '@angular/core';
import { localStorageCollection } from '../../../../environments/myconfigs';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private dataSubject = new Subject<any>();
  private viewUUIDTabs : string[] = [];

  constructor() { 
    this.loadUUIDTabsFromStorage();
  }

  getObservable() : Observable<any>{
    return this.dataSubject.asObservable();
  }

  loadUUIDTabsFromStorage(): void {
    //LOAD UUID TABS FROM LOCALSTORAGE.....
    let temp = localStorage.getItem(localStorageCollection.tabCollectionName);
    if(temp != null)
      this.viewUUIDTabs = JSON.parse(temp);
  }

  addViewTab(uuid : string): void {
    //ADD UUID TO THE ARRAY...
    const index = this.viewUUIDTabs.indexOf(uuid);
    //FOUND VIEWTAB....
    if(index < 0){
      this.viewUUIDTabs.push(uuid);      
    }

    this.dataSubject.next(uuid);
    //SAVE IT INTO LOCALSTORAGE....
    this.saveCurrectStateTabs();
  }

  //SAVE CURRENT STATE OF TABS TO THE LOCAL STORAGE....
  saveCurrectStateTabs(): void{
    //REINSTALL VIEWTAB ON LOCALSTORAGE....
    localStorage.setItem(localStorageCollection.tabCollectionName, JSON.stringify(this.viewUUIDTabs));
  }

  //REMOVE VIEW TAB....
  removeViewTab(uuid : string): void{
    //VIEWTABS OPERATION....
    const index = this.viewUUIDTabs.indexOf(uuid);
    //FOUND VIEWTAB....
    if(index > -1)
      this.viewUUIDTabs.splice(index, 1);

    this.dataSubject.next('Dashboard');
    //SAVE IT INTO LOCALSTORAGE....
    this.saveCurrectStateTabs();
  }

  getViewUUIDTabs(): string[]{
    return this.viewUUIDTabs;
  }
}
