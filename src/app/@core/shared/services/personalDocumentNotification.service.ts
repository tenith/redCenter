import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalNotificationService {  

  private cloudFunctionAnnouncement = API.cloudFunctionPersonalDocNotification; 

  constructor(private httpClient:HttpClient) { }

  PersonalDocumentNotification(docName: string, ownerEmail:string): Promise<any>{
    let params = new HttpParams().set('docName', docName).set('ownerEmail', ownerEmail);
    return this.httpClient.get<any>(this.cloudFunctionAnnouncement, {params:params}).toPromise();
  }
}
