import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseAuthenticationService } from './firebase-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private apiURL = 'https://script.google.com/macros/s/AKfycbyAPnu61zvXx0AJ1xP0P8pNN1rkq7wqFi09x31W6vXtR2Ze66AKXgaRx7oXUrz8iz57/exec';

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "text/plain;charset=utf-8", "mode":"no-cors" })
  };

  constructor(public fireBaseAuthService: FirebaseAuthenticationService, public httpClient: HttpClient) { }

  public getMyPerformanceInfo(year: string, info: string): Observable<any> {
    let params = new HttpParams()
                    .set('email', this.fireBaseAuthService.getFirebaseUser().email)
                    .set('year', year)
                    .set('info', info);

    return this.httpClient.get(this.apiURL,{params:params});
  }
}
