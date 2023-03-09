import { Injectable } from '@angular/core';
import { OneSepCard } from '../interfaces/one-sep-card';
import { oneSepCardsMockUp } from '../../mock/sep-card-mockup-data';

import { of as observableOf,  Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FirebaseAuthenticationService } from './firebase-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SepCardService {
  private apiURL = 'https://script.google.com/macros/s/AKfycbyxxKjMeBQgDOj1s1A78fK-xGpOQv-YIXNgaJxQTIWncsFYt4z-szGrbURz3sCCJv3I/exec';

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "text/plain;charset=utf-8", "mode":"no-cors" })
  };

  sepCardLocalDBName: string = 'SEPCardLocalDBName';  
  oneSepCards: OneSepCard[];

  constructor(public fireBaseAuthService: FirebaseAuthenticationService, public httpClient: HttpClient) { 
    /*
      09 MAR 2023 wutthichair
        Loading SEP Cards information from localStorage
    */
    const temp = localStorage.getItem(this.sepCardLocalDBName);
    this.oneSepCards = JSON.parse(temp) as OneSepCard[];
  }

  isInLocalStorage(): boolean{
    // console.log('isInlocalost');
    // console.log('value: ' + localStorage.getItem(this.sepCardLocalDBName));
    // console.log(localStorage.getItem(this.sepCardLocalDBName) != '');
    return localStorage.getItem(this.sepCardLocalDBName) != null;
  }

  getAllSepCards(): Observable<any> {
    let params = new HttpParams().set('email', this.fireBaseAuthService.getFirebaseUser().email);
    return this.httpClient.get(this.apiURL,{params:params});
  }

  saveAllSepCards(oneSepCards: OneSepCard[]): void {
    localStorage.setItem(this.sepCardLocalDBName,JSON.stringify(oneSepCards));
  }

  deleteAllSepCards(): void {
    localStorage.removeItem(this.sepCardLocalDBName);
  }

  getAllSepCardsFromCache(): OneSepCard[] {
    return this.oneSepCards;
  }
}
