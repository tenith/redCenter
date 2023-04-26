import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of as observableOf,  Observable } from 'rxjs';
import { AutolandSepCard } from '../interfaces/autoland-sep-card';
import { FirebaseAuthenticationService } from './firebase-authentication.service';

import { API } from '../../../../environments/myconfigs';
import { httpOptions } from '../../../../environments/myconfigs';
import { localStorageCollection } from '../../../../environments/myconfigs';

@Injectable({
  providedIn: 'root'
})
export class AutolandCardService {
  private apiURL = API.autolandGoogleSerivce;
  httpOptions = {headers: new HttpHeaders(httpOptions)};
    
  autoLandCardLocalDBName: string = localStorageCollection.autoLandCardCollectionName;
  autoLandCard: AutolandSepCard[];

  constructor(public fireBaseAuthService: FirebaseAuthenticationService, public httpClient: HttpClient) {
    /*
      13 MAR 2023 wutthichair
        Fetch Data From Server
    */
    const temp = localStorage.getItem(this.autoLandCardLocalDBName);
    if(temp == null)
      this.autoLandCard = [{name: 'AUTOLAND - ONLINE', airport: '', perform: '', validperiod: '', expiry: ''},
                           {name: 'AUTOLAND - SIMULATOR', airport: '', perform: '', validperiod: '', expiry: ''}] as AutolandSepCard[];
    else
      this.autoLandCard = JSON.parse(temp) as AutolandSepCard[];
    // console.log('constructor of autoland servicec : ' + JSON.stringify(this.autoLandCard));
  }

  isInLocalStorage(): boolean{
    return localStorage.getItem(this.autoLandCardLocalDBName) != null;
  }

  saveAllSepCards(autoLandCard: AutolandSepCard[]): void {
    localStorage.setItem(this.autoLandCardLocalDBName,JSON.stringify(autoLandCard));
  }

  deleteAllSepCards(): void {
    localStorage.removeItem(this.autoLandCardLocalDBName);
  }
  
  getAutolandCard(name: string): Observable<any> {
    if(name.includes('ONLINE'))
      return observableOf(this.autoLandCard[0]);
    else
      return observableOf(this.autoLandCard[1]);
  }

  getAllAutolandCards(): Observable<any>{
    let params = new HttpParams().set('email', this.fireBaseAuthService.getFirebaseUser().email);
    return this.httpClient.get(this.apiURL,{params:params});
  }

  getAutolandCardFromCache(name: string): AutolandSepCard{
    if(name.includes('ONLINE'))
      return this.autoLandCard[0];
    else
      return this.autoLandCard[1];
  }

  getAllAutolandCardsFromCache(): AutolandSepCard[]{
    return this.autoLandCard;
  }

  postAutoLandForm(course : string, date : string, cat : string, runway : string, airport : string) : Observable<any>{
    var formData : any = new FormData();
    formData.append('email', this.fireBaseAuthService.getFirebaseUser().email);
    formData.append('course', course);
    formData.append('date',date);
    formData.append('cat',cat);
    formData.append('runway',runway);
    formData.append('airport',airport);
  
    return this.httpClient.post(this.apiURL,formData);
  }
}
