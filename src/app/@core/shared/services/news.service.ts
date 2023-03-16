import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '../interfaces/news';
import { FirebaseAuthenticationService } from './firebase-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiURL = 'https://script.google.com/macros/s/AKfycby3jym8YGxvVAo4uOh6D5L1w_nwQzS7Mr_w3Tu-LS-xnkbJeUzvLPaz7Zbuo36mT2RL/exec';

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "text/plain;charset=utf-8", "mode":"no-cors" })
  };

  newsLocalDBName: string = 'NewsLocalDBName';  
  newsList: News[];

  constructor(public fireBaseAuthService: FirebaseAuthenticationService, public httpClient: HttpClient) { 
    /*
      16 MAR 2023 wutthichair
        Loading SEP Cards information from localStorage
    */
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
