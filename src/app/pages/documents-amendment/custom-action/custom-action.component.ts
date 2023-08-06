import { Component, Input, OnInit } from "@angular/core";
import { AnnouncementService } from "../../../@core/shared/services/announcement.service";
import { NbDialogRef, NbDialogService, NbToastrService } from "@nebular/theme";
import { DeleteConfirmationComponent } from "../delete-confirmation/delete-confirmation.component";
import { FirestoreUserService } from "../../../@core/shared/services/firestore-user.service";
import { AnnouncementConfirmationComponent } from "../announcement-confirmation/announcement-confirmation.component";

@Component({
  selector: "ngx-custom-action",
  templateUrl: "./custom-action.component.html",
  styleUrls: ["./custom-action.component.scss"],
})
export class CustomActionComponent implements OnInit {
  @Input() rowData: any;
  isAcknowledge: boolean = false;
  isReadOnly: boolean = false;
  canDelete: boolean = false;

  dialogRef: NbDialogRef<DeleteConfirmationComponent>;
  confirmDialogRef: NbDialogRef<AnnouncementConfirmationComponent>;

  constructor(
    private dialogService: NbDialogService,
    private announcementService: AnnouncementService,
    private toastr: NbToastrService,
    private firestoreUserService: FirestoreUserService,
  ) {}

  ngOnInit(): void {
    if (this.rowData.acknowledge == "Yes") {
      const tempIndex = this.firestoreUserService.isAcknowledge(
        this.rowData.code,
      );
      if (tempIndex >= 0) this.isAcknowledge = true;
    } else this.isReadOnly = true;
    this.canDelete = this.firestoreUserService.canDelete();
  }

  encodeTitle(title: string): string {
    return encodeURIComponent(title);
  }

  makeAnnouncement(): void {
    this.confirmDialogRef = this.dialogService.open(
      AnnouncementConfirmationComponent,
      {
        context: {
          data: {
            myCode: this.rowData.code,
          },
        },
      },
    );

    this.confirmDialogRef.onClose.subscribe((confirm) => {
      if (confirm == "affirm") {
        //Announce an announcement code....
        this.announcementService
          .makeAnnouncement(this.rowData.code)
          .then(() => {
            this.toastr.primary(
              "Completed",
              "Announce " + this.rowData.code + " completed",
            );
          })
          .catch((error) => {
            // console.log(error);
            if (error.status != 200)
              this.toastr.danger(
                "error",
                "Announce " + this.rowData.code + " failed, try again later",
              );
            else
              this.toastr.primary(
                "Completed",
                "Announce " + this.rowData.code + " completed",
              );
          });
      }
    });
  }

  deleteAnnouncement(): void {
    // console.log('delte' + this.rowData.code);
    this.dialogRef = this.dialogService.open(DeleteConfirmationComponent, {
      context: {
        data: {
          myCode: this.rowData.code,
        },
      },
    });

    this.dialogRef.onClose.subscribe((confirm) => {
      if (confirm == "affirm") {
        //Delete an announcement code....
        this.announcementService
          .deleteAnnouncement(encodeURIComponent(this.rowData.code))
          .then(() => {
            this.toastr.primary(
              "Completed",
              "Delete " + this.rowData.code + " announement completed",
            );
          })
          .catch((error) => {
            // console.log(error);
            this.toastr.danger(
              "error",
              "Delete " +
                this.rowData.code +
                " announement failed, try again later",
            );
          });
      }
    });
  }
}
