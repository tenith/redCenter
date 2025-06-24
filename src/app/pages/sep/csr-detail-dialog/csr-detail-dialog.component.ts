import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, timeout } from "rxjs/operators";
import { FirestoreUserService } from "../../../@core/shared/services/firestore-user.service";
import { httpOptions } from "../../../../environments/myconfigs";

@Component({
  selector: "ngx-csr-detail-dialog",
  templateUrl: "./csr-detail-dialog.component.html",
  styleUrls: ["./csr-detail-dialog.component.scss"],
})
export class CSRDetailDialogComponent implements OnInit {
  @Input() data: any;
  apiResponse: any; // Adjust type based on API response structure
  httpOptions = { headers: new HttpHeaders(httpOptions) };

  constructor(
    private http: HttpClient,
    private firestoreUserService: FirestoreUserService,
    protected dialogRef: NbDialogRef<CSRDetailDialogComponent>
  ) {}

  ngOnInit(): void {
    const staffId = this.firestoreUserService.getFirestoreUser().cId;
    const apiUrl = `https://script.google.com/macros/s/AKfycbzExtNHU25qmPv5rEsFL3xZJZaeZpTC78GgTHJI5zXwOnMW_h_gje0LyXb7nqM4CjwHlQ/exec`;

    let params = new HttpParams().set("staffid", staffId);

    this.http
      .get(apiUrl, { params: params })
      .pipe(
        timeout(10000), // 5 seconds timeout
        catchError((error) => {
          this.apiResponse = {
            error: true,
          };

          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this.apiResponse = response; // Store response for template
        },
        error: (error) => {
          console.error("Error fetching API data:", error);
        },
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
