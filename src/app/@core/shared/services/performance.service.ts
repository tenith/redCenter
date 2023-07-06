import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseAuthenticationService } from './firebase-authentication.service';

import { httpOptions } from '../../../../environments/myconfigs';
import { API } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private apiURL = API.performanceGoogleService;
  httpOptions = {headers: new HttpHeaders(httpOptions)};

  constructor(public fireBaseAuthService: FirebaseAuthenticationService, public httpClient: HttpClient) { }

  public getMyPerformanceInfo(year: string, info: string): Observable<any> {
    let params = new HttpParams()
                    .set('email', this.fireBaseAuthService.getFirebaseUser().email)
                    .set('year', year)
                    .set('info', info);

    return this.httpClient.get(this.apiURL,{params:params});
  }
}
