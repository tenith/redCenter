import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "ngx-pc-detail-dialog",
  templateUrl: "./pc-detail-dialog.component.html",
  styleUrls: ["./pc-detail-dialog.component.scss"],
})
export class PcDetailDialogComponent implements OnInit {
  @Input() data: any;
  selectedSubDetail: string = "";
  constructor(public dialogRef: NbDialogRef<PcDetailDialogComponent>) {}

  ngOnInit(): void {
    const predefineInput = this.data.input;
    const type = this.data.type;
    if (predefineInput != null || predefineInput != "") {
      let result;
      if (type == "PC") result = predefineInput.match(/\[(\d+)\]/);
      else result = predefineInput.match(/\{(\d+)\}/);

      if (result) {
        this.selectedSubDetail = result[1].toString();
      }
    }
  }

  confirmSelection(): void {
    this.dialogRef.close(this.selectedSubDetail); // Return selected value
  }

  closeDialog(): void {
    this.dialogRef.close(null); // Close without returning value
  }

  selectSubPC(subPCNumber: number) {
    this.selectedSubDetail = subPCNumber.toString(); // Update selection
  }
}
