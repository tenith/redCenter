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

import { ThemeModule } from '../../@theme/theme.module';

import { DocumentsAmendmentComponent } from './documents-amendment.component';
import { PostingDocumentsAmendmentComponent } from './posting-documents-amendment/posting-documents-amendment.component';
import { DocumentsAmendmentTableComponent } from './documents-amendment-table/documents-amendment-table.component';
import { DocumentComponent } from './document/document.component';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../miscellaneous/not-found/not-found.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomLinkComponent } from './custom-link/custom-link.component';
import { CustomActionComponent } from './custom-action/custom-action.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { ModeratorGuard } from '../../@core/shared/guards/moderator.guard';


import { NgxWatermarkModule } from 'ngx-watermark';
import { AnnouncementConfirmationComponent } from './announcement-confirmation/announcement-confirmation.component';

const routes: Routes = [{
  path: '',
  component: DocumentsAmendmentComponent,
  children: [
    { path: 'dashboard', component: DocumentsAmendmentTableComponent},
    { path: 'announce', canActivate: [ModeratorGuard], component: PostingDocumentsAmendmentComponent},
    { path: 'document', component: DocumentComponent},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
  ],
}];

@NgModule({
  declarations: [  
    DocumentsAmendmentComponent,
    PostingDocumentsAmendmentComponent,
    DocumentsAmendmentTableComponent,
    DocumentComponent,
    CustomLinkComponent,
    CustomActionComponent,
    DeleteConfirmationComponent,
    AnnouncementConfirmationComponent,
  ],
  imports: [
    NgxWatermarkModule,
    Ng2SmartTableModule,
    ThemeModule,
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
    NbIconModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class DocumentsAmendmentModule { }
