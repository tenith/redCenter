import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VerificationHistoryComponent } from "./verification-history/verification-history.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbButton,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTooltipModule,
} from "@nebular/theme";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPrintModule } from "ngx-print";

@NgModule({
  declarations: [VerificationHistoryComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbIconModule,
    NbTooltipModule,
    FormsModule,
    NbInputModule,
    NbButtonModule,
    ReactiveFormsModule,
    NgxPrintModule,
  ],
})
export class VerificationHistoryModule {}
