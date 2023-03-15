import { Injectable } from '@angular/core';
import { OneSepCard } from '../interfaces/one-sep-card';
import { oneSepCardsMockUp } from '../../mock/sep-card-mockup-data';

import { of as observableOf,  Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FirebaseAuthenticationService } from './firebase-authentication.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

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

  constructor(public fireBaseAuthService: FirebaseAuthenticationService, public httpClient: HttpClient, public dbService: NgxIndexedDBService) { 
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

  /*
    15 Mar 2023 wutthichair
      Impletement getImage
  */
  async getBase64ImageFromUrl(imageUrl: string) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
  
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
  
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  /*
    15 Mar 2023 wutthichair
      Implement save Certificate into database
  */
  saveAllCertificate(): void{
    for(let i=0;i<this.oneSepCards.length;i++){
      if(this.oneSepCards[i].link != ''){
        this.dbService.getByIndex("certificates",'link',this.oneSepCards[i].link).subscribe((data)=> {
          if(data == null){
            this.getBase64ImageFromUrl(this.oneSepCards[i].link)
              .then(result => {
                console.log(JSON.stringify(result));
                this.dbService.add("certificates",{link:this.oneSepCards[i].link,uri:result}).subscribe();
              })
              .catch(err => console.error(err));
          }
        });
      }
    }
  }

  /*
    15 Mar 2023 wutthichai
      Implement clear certificate from server
  */
  deleteAllCertificate(): void{
    // console.log('delete certificate');
    // this.dbService.deleteDatabase().subscribe(data=>{});
  }
  
  /*
    15 Mar 2023 wutthichair
      Loading data from cache
  */
  getURIByLink(linkURL : string) : Observable<any>{
    return this.dbService.getByIndex("certificates", 'link', linkURL);
  }

  saveAllSepCards(oneSepCards: OneSepCard[]): void {
    localStorage.setItem(this.sepCardLocalDBName,JSON.stringify(oneSepCards));
    this.saveAllCertificate();
  }

  deleteAllSepCards(): void {
    localStorage.removeItem(this.sepCardLocalDBName);
    this.deleteAllCertificate();
  }

  getAllSepCardsFromCache(): OneSepCard[] {
    return this.oneSepCards;
  }
}
