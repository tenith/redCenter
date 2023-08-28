import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { FileUploadInformation } from "../../../@core/shared/interfaces/file-upload-information";
import { DatePipe } from "@angular/common";
import { FileVerificationHistoryService } from "../../../@core/shared/services/file-verification-history.service";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "ngx-verification-history",
  templateUrl: "./verification-history.component.html",
  styleUrls: ["./verification-history.component.scss"],
})
export class VerificationHistoryComponent implements OnInit {
  fileInforList: FileUploadInformation[] = [];

  formattedDate: string;
  sub: Subscription;

  uploadForm: FormGroup;

  source: LocalDataSource;
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: 50,
    },
    columns: {
      uploadTime: {
        title: "Published Date",
        sortDirection: "desc",
        filter: false,
        width: "15%",
        type: "date",
        valuePrepareFunction: (date) => {
          if (date == "" || date == "-") return "-";

          let formattedDate = "";
          // console.log(date);
          try {
            formattedDate = new DatePipe("en-US").transform(
              date,
              "dd MMM yyyy HH:mm:ss"
            );
          } catch (e) {
            const inputDateString = date;
            const [datePart, timePart] = inputDateString.split(", ");
            const [day, month, year] = datePart.split("/");
            date = `${month}/${day}/${year}, ${timePart}`;
            formattedDate = new DatePipe("en-US").transform(
              date,
              "dd MMM yyyy HH:mm:ss"
            );
          }
          // console.log(formattedDate);
          return formattedDate.toUpperCase();
        },
      },
      owner: { title: "Owner Email", width: "12%" },
      id: { title: "TAA ID" },
      displayName: { title: "Name" },
      fileCategory: { title: "Category", width: "12%" },
      description: { title: "Description" },
      issueDate: {
        title: "Issue Date",
        filter: false,
        width: "15%",
        type: "date",
        valuePrepareFunction: (date) => {
          if (date == "" || date == "-") return "-";

          const datePipe = new DatePipe("en-US");
          const formattedDate = datePipe.transform(date, "dd MMM yyy");
          return formattedDate.toUpperCase();
        },
      },
      expiryDate: {
        title: "Expiry Date",
        filter: false,
        width: "15%",
        type: "date",
        valuePrepareFunction: (date) => {
          if (date == "" || date == "-") return "-";

          const datePipe = new DatePipe("en-US");
          const formattedDate = datePipe.transform(date, "dd MMM yyy");
          return formattedDate.toUpperCase();
        },
      },
      validatorEmail: { title: "Validated by" },
      validateTimestamp: { title: "Validated at" },
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private fileUploadHistoryService: FileVerificationHistoryService
  ) {
    this.formattedDate = new DatePipe("en-US").transform(
      new Date(),
      "dd MMM yyyy"
    );
  }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      searchDate: [
        new Date().toISOString().substring(0, 10),
        Validators.required,
      ],
    });

    this.subScribe(this.formattedDate);
  }

  search(): void {
    this.reset();
    this.formattedDate = new DatePipe("en-US").transform(
      this.uploadForm.get("searchDate").value,
      "dd MMM yyyy"
    );
    this.subScribe(this.formattedDate);
  }

  subScribe(formattedDate: string): void {
    this.unsub();
    this.sub = this.fileUploadHistoryService
      .getHistoryOn(formattedDate)
      .subscribe((data) => {
        this.fileInforList = [...data.files] as FileUploadInformation[];
        this.refresh();
      });
  }

  unsub(): void {
    if (this.sub != undefined) this.sub.unsubscribe();
  }

  reset(): void {
    this.source = new LocalDataSource([]);
  }

  refresh(): void {
    const temp = this.fileInforList;
    this.source = new LocalDataSource([...temp]);
  }
}
