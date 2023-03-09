import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of as observableOf,  Observable } from 'rxjs';
import { autoLandCardMockup } from '../../mock/autoland-mockup-data';
import { AutolandSepCard } from '../interfaces/autoland-sep-card';
import { FirebaseAuthenticationService } from './firebase-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AutolandCardService {
  private apiURL = 'https://script.google.com/macros/s/AKfycbyxxKjMeBQgDOj1s1A78fK-xGpOQv-YIXNgaJxQTIWncsFYt4z-szGrbURz3sCCJv3I/exec';

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "text/plain;charset=utf-8", "mode":"no-cors" })
  };

  autoLandCardLocalDBName: string = 'AutoLandCardLocalDBName';
  autoLandCard: AutolandSepCard[];

  constructor(public fireBaseAuthService: FirebaseAuthenticationService, public httpClient: HttpClient) {
    const temp = localStorage.getItem(this.autoLandCardLocalDBName);
    if(temp != null){
      this.autoLandCard = JSON.parse(temp) as AutolandSepCard[];
    }
    else{
      this.autoLandCard = [...autoLandCardMockup];
    }
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
    // let params = new HttpParams().set('email', this.fireBaseAuthService.getFirebaseUser().email);
    // return this.httpClient.get(this.apiURL,{params:params});
    if(name.includes('ONLINE'))
      return observableOf(this.autoLandCard[0]);
    else
      return observableOf(this.autoLandCard[1]);
  }

  getAllAutolandCards(): Observable<any>{
    // let params = new HttpParams().set('email', this.fireBaseAuthService.getFirebaseUser().email);
    // return this.httpClient.get(this.apiURL,{params:params});
    return observableOf(this.autoLandCard);
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
}
