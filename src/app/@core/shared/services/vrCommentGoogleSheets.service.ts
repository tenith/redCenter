import { Injectable } from "@angular/core";
import { httpOptions } from "../../../../environments/myconfigs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../../environments/environment";
import { CommentDetail } from "../interfaces/comment";

@Injectable({
  providedIn: "root",
})
export class VRCommentGoogleSheetsSerivce {
  private apiURL = API.vrCommentGoogleService;
  httpOptions = { headers: new HttpHeaders(httpOptions) };

  constructor(private httpClient: HttpClient) {}

  post(date: string, comments: CommentDetail[]): Observable<any> {
    var formData: any = new FormData();
    formData.append("date", date);
    formData.append("vrComments", JSON.stringify(comments));
    return this.httpClient.post(this.apiURL, formData);
  }
}
