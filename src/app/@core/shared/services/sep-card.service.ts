import { Injectable } from '@angular/core';
import { OneSepCard } from '../interfaces/one-sep-card';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FirebaseAuthenticationService } from './firebase-authentication.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

import { API } from '../../../../environments/myconfigs';
import { httpOptions } from '../../../../environments/myconfigs';
import { localStorageCollection } from '../../../../environments/myconfigs';
import { settings } from '../../../../environments/myconfigs';

@Injectable({
  providedIn: 'root'
})
export class SepCardService {
  private redBookTMCURL = API.redBookTMC;
  private key = API.redBookTMC_X;
  private apiURL = API.sepGoogleService;
  httpOptions = {headers: new HttpHeaders(httpOptions)};

  sepCardLocalDBName: string = localStorageCollection.sepLocalDBNameCollectionName;  
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
    return localStorage.getItem(this.sepCardLocalDBName) != null;
  }

  private getAllSepCardsFromTMC(): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-api-key', this.key);

    let params = new HttpParams().set('email', this.fireBaseAuthService.getFirebaseUser().email);
    return this.httpClient.get(this.redBookTMCURL,{params:params});
  }

  getAllSepCards(): Observable<any> {
    if(settings.redBookTMC)
      return this.getAllSepCardsFromTMC();

    
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
    if(this.oneSepCards == null)
      return;

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
