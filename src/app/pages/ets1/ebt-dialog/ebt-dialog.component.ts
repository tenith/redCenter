import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { competenciesData } from "../../../@core/shared/data/competenciesData";
import { PilotCompetency } from "../../../@core/shared/interfaces/pilotCompetency";

@Component({
  selector: "ngx-ebt-dialog",
  templateUrl: "./ebt-dialog.component.html",
  styleUrls: ["./ebt-dialog.component.scss"],
})
export class EbtDialogComponent implements OnInit {
  // Input: array of pilot competencies to prefill observed/max
  @Input() data: PilotCompetency[] = [];

  // Full competencies subset (index 1 to 9 of master list)
  competenciesData: any[] = [];

  constructor(public dialogRef: NbDialogRef<EbtDialogComponent>) {}

  ngOnInit() {
    // Always use slice(1,10) from master data as base list
    this.competenciesData = competenciesData.slice(1, 10).map((comp) => ({
      ...comp,
      subPCs: comp.subPCs.map((sub: any) => ({
        ...sub,
        observed: 0,
        max: 0,
      })),
    }));

    // If input data provided, apply observed/max values onto matching PCs
    if (this.data && this.data.length > 0) {
      this.data.forEach((inputComp) => {
        const matchComp = this.competenciesData.find(
          (c) => c.number === inputComp.id
        );

        if (matchComp && inputComp.obList) {
          // Map input observed values into subPCs by matching obID
          inputComp.obList.forEach((inputOb) => {
            const matchSub = matchComp.subPCs.find(
              (s: any) => s.number === inputOb.id
            );
            if (matchSub) {
              matchSub.observed = inputOb.observed ?? 0;
              matchSub.max = inputOb.observed ?? 0;
            }
          });
        }
      });
    }
  }

  onObservedChange(sub: any) {
    if (!sub.max || sub.observed > sub.max) {
      sub.max = sub.observed;
    }
  }

  hasMax(comp: any): boolean {
    return comp.subPCs?.some((s: any) => s.max > 0) ?? false;
  }

  saveCompetency(comp: any) {
    // // console.log(`Saving ${comp.code || comp.id}`);
    // comp.subPCs.forEach((s: any) =>
    //   console.log(
    //     `  SubPC ${s.number || s.obID}: Obs=${s.observed || 0}, Max=${
    //       s.max || 0
    //     }`
    //   )
    // );
  }

  submitAll() {
    // console.log("Submitting all data...");
    this.competenciesData.forEach((comp) => this.saveCompetency(comp));

    const result: PilotCompetency[] = this.competenciesData
      .map((comp) => ({
        id: comp.number,
        obList: (comp.subPCs || [])
          .filter((s: any) => s.observed > 0 || s.max > 0)
          .map((s: any) => ({
            id: s.number, // Make sure subPC uses `obID` as the OB ID
            observed: s.observed ?? 0,
            total: s.max ?? 0,
            note: s.note || "",
          })),
      }))
      .filter((pc) => pc.obList.length > 0); // only return PCs with data
    // console.log(JSON.stringify(result));
    this.dialogRef.close(result);
  }

  closeDialog() {
    // console.log("Dialog closed");
    this.dialogRef.close();
  }
}
