import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  EventEmitter,
  Output,
} from "@angular/core";
import { OneSepCard } from "../../../@core/shared/interfaces/one-sep-card";
import { SepCardService } from "../../../@core/shared/services/sep-card.service";

import {
  requiredVerify,
  sepCourseDisplayOptions,
  statusConfig,
  strictVerify,
} from "../../../../environments/myconfigs";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Observable, Subscription, fromEvent, interval } from "rxjs";
import { take } from "rxjs/operators";
import { FileUploadDatabaseService } from "../../../@core/shared/services/file-upload-database.service";
import { ManualCardService } from "../../../@core/shared/services/manual-card.service";
import { DeleteConfirmationComponent } from "../delete-confirmation/delete-confirmation.component";
import { NbDialogRef, NbDialogService, NbToastrService } from "@nebular/theme";
import { FileUploadInformation } from "../../../@core/shared/interfaces/file-upload-information";
import { FirestoreUserService } from "../../../@core/shared/services/firestore-user.service";
import { SepHistoicalService } from "../../../@core/shared/services/sepHistorical.service";
import { FileUploadInformationService } from "../../../@core/shared/services/file-upload-information.service";

@Component({
  selector: "ngx-one-sep-card",
  templateUrl: "./one-sep-card.component.html",
  styleUrls: ["./one-sep-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OneSepCardComponent implements OnInit, OnDestroy {
  @Input() info?: OneSepCard;
  @Input() allHistory?: OneSepCard[];
  @Input() canDelete: boolean = false;
  @Output() postCompleteEvent = new EventEmitter<string>();
  @Output() deleteEvent = new EventEmitter<string>();
  @Output() refreshEvent = new EventEmitter<string>();
  myStatus: string;
  myIcon: string;

  displayOption = sepCourseDisplayOptions;

  postRequired: boolean = false;

  pdfLink: string;

  cacheLink: SafeResourceUrl;
  uri: string = "";
  dataReady: boolean = false;

  isPersonalDocument: boolean = false;
  downloadUrl$: Observable<string>;

  pdfSupport: boolean = false;

  private pollSubscription: Subscription;
  safeURL: SafeResourceUrl;

  offline: boolean = true;

  offlineEvent: Observable<Event>;
  onlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  showInitial: boolean = false;
  showHistory: boolean = false;

  pendingStatus: boolean = false;

  dialogRef: NbDialogRef<DeleteConfirmationComponent>;

  constructor(
    private sepHistoricalService: SepHistoicalService,
    private firestoreUser: FirestoreUserService,
    private toastr: NbToastrService,
    private dialogService: NbDialogService,
    private manualCardService: ManualCardService,
    private fileUploadDatabaseService: FileUploadDatabaseService,
    public sepService: SepCardService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnDestroy(): void {
    this.stopPolling();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.offline = !navigator.onLine;
    this.handleAppConnectivityChanges();

    // console.log(JSON.stringify(this.info));

    if (this.info.Name in this.displayOption) {
      this.showInitial = this.displayOption[this.info.Name].Initial;
      this.showHistory = this.displayOption[this.info.Name].ShowHistory;
    }

    if (this.allHistory == null) {
      const temp = this.sepHistoricalService.getHistorical(this.info.Name);
      if (temp.length > 0) this.allHistory = temp;
    } else
      this.sepHistoricalService.addHistorical(this.info.Name, this.allHistory);

    if ("application/pdf" in navigator.mimeTypes) this.pdfSupport = true;

    if (this.info.Type == "Personal Upload") {
      this.isPersonalDocument = true;
      this.downloadUrl$ = this.fileUploadDatabaseService.getFile(
        this.info.Link,
      );
    }

    this.setupCard();
  }

  private handleAppConnectivityChanges(): void {
    this.offline = !navigator.onLine;

    this.onlineEvent = fromEvent(window, "online");
    this.offlineEvent = fromEvent(window, "offline");

    this.subscriptions.push(
      this.onlineEvent.subscribe((e) => {
        // handle online mode
        this.offline = false;
        this.cdr.detectChanges();
      }),
    );

    this.subscriptions.push(
      this.offlineEvent.subscribe((e) => {
        // handle offline mode
        this.offline = true;
        this.cdr.detectChanges();
      }),
    );
  }

  setupCard(): void {
    this.startPolling();

    if (this.info.Name == "RHS" || this.info.Name == "LINE CHECK") {
      if (
        this.info.InitialDate == "NO DATA" ||
        this.info.InitialDate == null ||
        this.info.InitialDate == undefined
      ) {
        this.sepService
          .getAllSepCardsFromGoogleAPI(this.info.Name)
          .subscribe((response) => {
            console.log("JSON Google API: " + JSON.stringify(response));
            if (response != null && Object.keys(response).length != 0) {
              let temp = {
                ...JSON.parse(JSON.stringify(response)),
              } as OneSepCard;
              this.info.InitialDate = temp.InitialDate;
              this.reviseStatus();
              this.cdr.detectChanges();
            }
          });
      }
    }

    if (this.info.Expiry == "NO DATA") {
      this.setStatusDanger();

      //Temporary solution to get data from google sheets....
      this.sepService
        .getAllSepCardsFromGoogleAPI(this.info.Name)
        .subscribe((response) => {
          // console.log(this.info.Name);
          console.log("JSON Google API: " + JSON.stringify(response));
          if (response != null && Object.keys(response).length != 0) {
            // this.info = {...JSON.parse(JSON.stringify(response))} as OneSepCard;
            let temp = {
              ...JSON.parse(JSON.stringify(response)),
            } as OneSepCard;
            // console.log('NO DATA: ' + JSON.stringify(temp));
            temp.InitialDate = "NO DATA";
            // console.log('INIT DATA: ' + JSON.stringify(temp.InitialDate));
            this.info = temp;
            this.reviseStatus();
            this.postCompleteEvent.emit(JSON.stringify(this.info));
          }
        });
    } else {
      this.reviseStatus();
    }
  }

  generateDownloadLink() {
    let type = "application/pdf";
    if (!this.uri.split(",")[0].includes("pdf")) type = "image/png";

    const blob = this.base64ToBlob(this.uri.split(",")[1], type);
    const url = URL.createObjectURL(blob);
    this.pdfLink = url;
  }

  postCompletedUpdateThisCard(): void {
    // console.log('postCompletedUpdateThisCard');
    this.setupCard();
  }

  downloadPdf() {
    this.generateDownloadLink();
    // window.open(this.pdfLink, '_blank');
    const shareData = {
      title: "PDF File",
      text: "Download the PDF file",
      url: this.pdfLink,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator
        .share(shareData)
        .then(() => {
          // console.log('Sharing succeeded.');
        })
        .catch((error) => {
          // console.error('Sharing failed:', error);
        });
    } else {
      window.open(this.pdfLink, "_blank");
    }
  }

  base64ToBlob(base64Data: string, contentType: string) {
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  deleteDocument(): void {
    this.dialogRef = this.dialogService.open(DeleteConfirmationComponent, {
      context: {
        data: {
          myCode: this.info.Name,
        },
      },
    });

    this.dialogRef.onClose.subscribe((confirm) => {
      if (confirm == "affirm") {
        const user = this.firestoreUser.getFirestoreUser();

        // console.log('try to delete: ' + JSON.stringify(this.info));

        this.fileUploadDatabaseService
          .deleteFileByName(this.info.Link, user.email)
          .then(() => {
            this.toastr.primary(
              "Completed",
              "Delete " + this.info.Name + " document completed",
            );
            this.deleteEvent.emit();
          })
          .catch((error) => {
            console.log(error);
            this.toastr.danger(
              "error",
              "Delete " + this.info.Name + " document failed, try again later",
            );
          });
      }
    });
  }

  reviseStatus(): void {
    const msInDay = 24 * 60 * 60 * 1000;
    const today = new Date().getTime() + msInDay;
    const expire = new Date(this.info.Expiry).getTime() + msInDay;
    const diffDate = (expire - today) / msInDay;

    this.pendingStatus = false;

    if (this.info.verify != undefined) {
      if (this.info.verify == false) {
        if (
          strictVerify[this.firestoreUser.getFirestoreUser().role].includes(
            this.info.Name,
          )
        ) {
          this.setPending();
          this.pendingStatus = true;
          this.cdr.detectChanges();
          return;
        }
      }
    } else {
      if (
        strictVerify[this.firestoreUser.getFirestoreUser().role].includes(
          this.info.Name,
        )
      ) {
        this.setPending();
        this.pendingStatus = true;
        this.cdr.detectChanges();
        return;
      }
    }

    if (diffDate < 0) this.setStatusDanger();
    if (diffDate > 30) this.setStatusSuccess();
    if (diffDate <= 30 && diffDate >= 0) this.setStatusWarning();

    if (this.info.Expiry == "-") this.setStatusSuccess();

    this.cdr.detectChanges();
  }

  startPolling() {
    this.pollSubscription = interval(3000) // Adjust the polling interval as per your requirements
      .pipe(take(100)) // Limit the number of polls to avoid infinite looping
      .subscribe(() => {
        this.checkFileStatus();
      });
  }

  stopPolling() {
    this.dataReady = true;
    this.cdr.detectChanges();
    this.refreshEvent.emit("");
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  checkFileStatus(): void {
    if (this.info.Link == "") this.stopPolling();
    else {
      if (!this.isPersonalDocument) {
        try {
          this.sepService
            .getURIByLink(
              this.info.Name.replace(/ /g, "_") +
                this.info.Attended.replace(/ /g, "_"),
            )
            .subscribe((data) => {
              if (data != null && data != "") {
                this.uri = data.uri;
                this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(
                  this.uri,
                );
                this.cdr.detectChanges();
                this.stopPolling();
              }
            });
        } catch (e) {
          // console.log(e);
        }
      }

      if (this.isPersonalDocument) {
        try {
          this.manualCardService
            .getURIByLink(this.info.Link)
            .subscribe((data) => {
              if (data != null) {
                this.uri = data.uri;
                this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(
                  this.uri,
                );
                this.cdr.detectChanges();
                this.stopPolling();
              }
            });
        } catch (e) {
          // console.log(e);
        }
      }
    }
  }

  openPDF(): void {
    if (!this.isPersonalDocument) {
      const link = document.createElement("a");
      link.href = this.uri;
      link.download = this.info.Name + ".pdf";
      link.target = "_blank";
      link.click();
    }
  }

  getSafeURL(): SafeResourceUrl {
    return this.safeURL;
  }

  setPending(): void {
    this.myStatus = statusConfig.pending.status;
    this.myIcon = statusConfig.pending.icon;
  }

  setStatusSuccess(): void {
    this.myStatus = statusConfig.success.status;
    this.myIcon = statusConfig.success.icon;
  }

  setStatusWarning(): void {
    this.myStatus = statusConfig.warning.status;
    this.myIcon = statusConfig.warning.icon;
  }

  setStatusDanger(): void {
    this.myStatus = statusConfig.danger.status;
    this.myIcon = statusConfig.danger.icon;
  }
}
