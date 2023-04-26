import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '../interfaces/news';
import { FirebaseAuthenticationService } from './firebase-authentication.service';

import { API } from '../../../../environments/myconfigs';
import { httpOptions } from '../../../../environments/myconfigs';
import { localStorageCollection } from '../../../../environments/myconfigs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiURL = API.newsGoogleService;
  httpOptions = {headers: new HttpHeaders(httpOptions)};

  newsLocalDBName: string = localStorageCollection.newsLocalDBNameCollectionName;  
  newsList: News[];

  constructor(public fireBaseAuthService: FirebaseAuthenticationService, public httpClient: HttpClient) { 
    const temp = localStorage.getItem(this.newsLocalDBName);
    this.newsList = JSON.parse(temp) as News[];
  }

  isInLocalStorage(): boolean{
    return localStorage.getItem(this.newsLocalDBName) != null;
  }

  getAllNews(): Observable<any> {
    return this.httpClient.get(this.apiURL);
  }

  saveAllNews(newsList: News[]): void {
    localStorage.setItem(this.newsLocalDBName,JSON.stringify(newsList));
  }

  deleteAllNewsFromCache(): void {
    localStorage.removeItem(this.newsLocalDBName);
  }

  getAllNewsFromCache(): News[] {
    const temp = localStorage.getItem(this.newsLocalDBName);
    this.newsList = JSON.parse(temp) as News[];
    return this.newsList;
  }
  
}
