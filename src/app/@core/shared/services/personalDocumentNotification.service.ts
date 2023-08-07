import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PersonalNotificationService {
  private cloudFunctionAnnouncement = API.cloudFunctionPersonalDocNotification;

  constructor(private httpClient: HttpClient) {}

  PersonalDocumentNotification(
    docName: string,
    ownerEmail: string,
    keyCode: string,
  ): Promise<any> {
    let params = new HttpParams()
      .set("docName", docName)
      .set("ownerEmail", ownerEmail)
      .set("keyCode", keyCode);
    return this.httpClient
      .get(this.cloudFunctionAnnouncement, {
        params: params,
        responseType: "text",
      })
      .toPromise();
  }
}
