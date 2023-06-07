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
import { resolve } from 'dns';

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
    const myParams = new HttpParams()
    .set('email', this.fireBaseAuthService.getFirebaseUser().email);
    
    const myHeaders = new HttpHeaders()
    .set('X-API-KEY', this.key)
    .set('Content-Type', 'application/json');

    return this.httpClient.get<any>(this.redBookTMCURL,{ params:myParams , headers: myHeaders});
  }

  getAllSepCards(): Observable<any> {
    if(settings.redBookTMC)
      return this.getAllSepCardsFromTMC();
    
    let params = new HttpParams().set('email', this.fireBaseAuthService.getFirebaseUser().email);
    return this.httpClient.get(this.apiURL,{params:params});
  }

  getAllSepCardsFromGoogleAPI(course: string): Observable<any> {
    let params = new HttpParams().set('email', this.fireBaseAuthService.getFirebaseUser().email)
                  .set('course', course);
    return this.httpClient.get(this.apiURL,{params:params});
  }

  /*
    15 Mar 2023 wutthichair
      Impletement getImage
  */
  getBase64ImageFromUrl(imageUrl: string, name: string): void {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/pdf')
    .set('X-API-KEY', this.key);
        
    this.httpClient.get<any>(imageUrl, { headers:headers, responseType: 'blob' as 'json'}).subscribe(data => {
        var reader  = new FileReader();
        reader.addEventListener("load", () => {
          // console.log(reader.result);
          // console.log('imageURL: ' + imageUrl);
          if(!(reader.result == undefined || reader.result == '' || reader.result == null))
            this.dbService.add("certificates",{link:name ,uri:reader.result}).subscribe();
        });
        reader.readAsDataURL(data);
      });
  }

  clearCertificateCache(): void {
    console.log('clear cert cache');
    this.dbService.clear("certificates");
  }

  /*
    15 Mar 2023 wutthichair
      Implement save Certificate into database
  */
  saveAllCertificate(): void{
    // console.log('saveAllCert');
    if(this.oneSepCards == null)
      return;

    for(let i=0;i<this.oneSepCards.length;i++){     
      if(this.oneSepCards[i].Link != ''){
        //wait for dbService ready...
        const randomTime = Math.floor(Math.random() * (10)) + 1;
        setTimeout(() => {} , randomTime * 10);

        const id = this.oneSepCards[i].Name.replace(/ /g,'_') + this.oneSepCards[i].Attended.replace(/ /g,'_');
        this.dbService.getByIndex("certificates",'link', id).subscribe((data)=> {
          if(data == null){
            console.log('data is null, have to request new one from server');
            this.getBase64ImageFromUrl(this.oneSepCards[i].Link, id);
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
    this.oneSepCards = oneSepCards;
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
