import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ETS1NotificationService {  

  private cloudFunctionAnnouncement = API.cloudFunctionETS1Notification; 

  constructor(private httpClient:HttpClient) { }

  ETS1Notification(ets1ID: string, ownerEmail:string): Promise<any>{
    let params = new HttpParams().set('ets1ID', ets1ID).set('ownerEmail', ownerEmail);
    return this.httpClient.get(this.cloudFunctionAnnouncement, {params:params, responseType:'text'}).toPromise();
  }
}
