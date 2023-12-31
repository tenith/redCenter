import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ThemeModule } from "../../@theme/theme.module";
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbToastrModule,
  NbTooltipModule,
} from "@nebular/theme";

import { PersonalDocumentsComponent } from "./personal-documents.component";
import { PersonalInformationComponent } from "./personal-information/personal-information.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { CustomActionComponent } from "./custom-action/custom-action.component";
import { DeleteConfirmationComponent } from "./delete-confirmation/delete-confirmation.component";
import { ViewDocumentComponent } from "./view-document/view-document.component";
import { SearchComponent } from "./search/search.component";
import { ReportComponent } from "./report/report.component";
import { NgxWatermarkModule } from "ngx-watermark";
import { NgxPrintModule } from "ngx-print";
import { ReportSummaryComponent } from "./report-summary/report-summary.component";

import { NbCheckboxModule } from "@nebular/theme";
import { NbSelectModule } from "@nebular/theme";
import { EditPersonalDocumentComponent } from "./edit-personal-document/edit-personal-document.component";

@NgModule({
  declarations: [
    PersonalDocumentsComponent,
    PersonalInformationComponent,
    FileUploadComponent,
    CustomActionComponent,
    DeleteConfirmationComponent,
    ViewDocumentComponent,
    SearchComponent,
    ReportComponent,
    ReportSummaryComponent,
    EditPersonalDocumentComponent,
  ],
  imports: [
    CommonModule,
    NgxPrintModule,
    NbSelectModule,
    NgxWatermarkModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    NbCheckboxModule,
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    NbToastrModule,
    NbTooltipModule,
    Ng2SmartTableModule,
  ],
  exports: [
    CustomActionComponent,
    DeleteConfirmationComponent,
    ViewDocumentComponent,
    EditPersonalDocumentComponent,
  ],
})
export class PersonalDocumentsModule {}
