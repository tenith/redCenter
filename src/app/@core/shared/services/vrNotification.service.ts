import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class VrNotificationService {
  private cloudFunctionAnnouncement = API.cloudFunctionVRNotification;

  constructor(private httpClient: HttpClient) {}

  VRNotification(vrId: string, ownerEmail: string): Promise<any> {
    let params = new HttpParams()
      .set("vrID", vrId)
      .set("ownerEmail", ownerEmail);
    return this.httpClient
      .get(this.cloudFunctionAnnouncement, {
        params: params,
        responseType: "text",
      })
      .toPromise();
  }
}
