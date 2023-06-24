import { Injectable } from '@angular/core';
import { API, httpOptions } from '../../../../environments/myconfigs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ETS1Data } from '../interfaces/e-ts1-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ETS1GoogleSheetsService {
  private apiURL = API.eTS1GoogleService;
  httpOptions = {headers: new HttpHeaders(httpOptions)};

  constructor(private httpClient: HttpClient) { }

  post(eTS1: ETS1Data): Observable<any>{
    var formData : any = new FormData();    
    formData.append("eTS1", JSON.stringify(eTS1));  
    return this.httpClient.post(this.apiURL,formData);
  }
}
