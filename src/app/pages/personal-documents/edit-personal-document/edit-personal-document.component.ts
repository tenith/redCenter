import {
  ChangeDetectorRef,
  Component,
  Inject,
  Injectable,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FileUploadInformationService } from "../../../@core/shared/services/file-upload-information.service";
import { FirestoreUserService } from "../../../@core/shared/services/firestore-user.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Observable, Subscription, fromEvent } from "rxjs";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { FileUploadInformation } from "../../../@core/shared/interfaces/file-upload-information";
import { DatePipe } from "@angular/common";
import { ngxWaterMarkOptions } from "../../../../environments/myconfigs";
import { NgxWatermarkOptions } from "ngx-watermark";
import { FileUploadDatabaseService } from "../../../@core/shared/services/file-upload-database.service";
import { FileReportService } from "../../../@core/shared/services/file-report.service";
import { ReportComponent } from "../report/report.component";

@Component({
  selector: "ngx-edit-personal-document",
  templateUrl: "./edit-personal-document.component.html",
  styleUrls: ["./edit-personal-document.component.scss"],
})
export class EditPersonalDocumentComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() formBuilder: FormGroup | any;
  uploadForm: FormGroup | any;

  downloadUrl$: Observable<string>;
  ngxWaterMarkOptions: NgxWatermarkOptions = ngxWaterMarkOptions;

  uploading: boolean = false;

  initData: any;

  offline: boolean = true;
  offlineEvent: Observable<Event>;
  onlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  reportDialogRef: NbDialogRef<ReportComponent>;

  constructor(
    private fileUploadDatabaseService: FileUploadDatabaseService,
    private fileUploadInfoService: FileUploadInformationService,
    private cdr: ChangeDetectorRef,
    private fileReportService: FileReportService,
    private dialogService: NbDialogService,
    private dialogRef: NbDialogRef<EditPersonalDocumentComponent>,
    private firestoreUserService: FirestoreUserService,
  ) {}

  ngOnInit(): void {
    this.handleAppConnectivityChanges();
    this.uploadForm = this.formBuilder;

    this.downloadUrl$ = this.fileUploadDatabaseService.getFile(
      this.data.relativePath,
    );

    this.uploadForm.controls["issueDate"].valueChanges.subscribe((value) => {
      this.reviseExpireDate();
    });

    this.ngxWaterMarkOptions.text =
      this.firestoreUserService.getFirestoreUser().email;
    this.initData = { ...this.data };
  }

  // report(): void {
  //   this.fileReportService.resetReport();
  //   this.fileReportService.addFileToReport(this.data);
  //   console.log('add data to report service: ' + this.data);
  //   this.reportDialogRef = this.dialogService.open(ReportComponent,{ hasScroll:true});
  //   this.reportDialogRef.onClose.subscribe(()=>{
  //     this.fileReportService.resetReport();
  //   });
  // }

  private reviseExpireDate(): void {
    const attendedDateString = new Date(this.uploadForm.get("issueDate").value);
    const datePipe = new DatePipe("en-US");
    const last12Month = datePipe.transform(
      new Date(
        attendedDateString.getFullYear(),
        attendedDateString.getMonth() + 13,
        0,
      ),
      "yyyy-MM-dd",
    );

    if (this.data.description.includes("Medical"))
      this.uploadForm.get("expiryDate").setValue(last12Month);
  }

  upload(): void {
    const datePipe = new DatePipe("en-US");
    const formattedDate = datePipe.transform(
      new Date(),
      "dd MMM yyyy HH:mm:ss",
    );

    this.data.issueBy = this.uploadForm.get("issueBy").value;
    this.data.issueDate = this.uploadForm.get("issueDate").value;
    this.data.expiryDate = this.uploadForm.get("expiryDate").value;
    this.data.uploadTime = formattedDate;
    this.data.verify = true;

    this.fileUploadInfoService.removeFileUploadInformation(
      this.initData as FileUploadInformation,
      this.data.owner,
    );
    this.fileUploadInfoService.addFileUploadInformation(
      this.data as FileUploadInformation,
      this.data.owner,
    );
    this.fileUploadInfoService.checkVerifyNeed(this.data.owner);

    this.cancel();
  }

  cancel(): void {
    this.dialogRef.close("");
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
