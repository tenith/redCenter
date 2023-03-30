import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbCardModule, NbIconModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';
import { NbInputModule } from '@nebular/theme';
import { NbTooltipModule } from '@nebular/theme';
import { NbRadioModule } from '@nebular/theme';
import { NbSelectModule } from '@nebular/theme';
import { NbToastrModule } from '@nebular/theme';
import { NbAccordionModule } from '@nebular/theme';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { DocumentsAmendmentComponent } from './documents-amendment.component';
import { PostingDocumentsAmendmentComponent } from './posting-documents-amendment/posting-documents-amendment.component';
import { DocumentsAmendmentTableComponent } from './documents-amendment-table/documents-amendment-table.component';

@NgModule({
  declarations: [     
    DocumentsAmendmentComponent,
    PostingDocumentsAmendmentComponent,
    DocumentsAmendmentTableComponent
  ],
  imports: [
    ReactiveFormsModule,
    NbAccordionModule,
    CommonModule,
    NbToastrModule,
    FormsModule,
    NbSelectModule,
    NbRadioModule,
    NbTooltipModule,
    NbInputModule,
    NbButtonModule,
    CommonModule,
    NbCardModule,
    NbIconModule
  ]
})
export class DocumentsAmendmentModule { }
