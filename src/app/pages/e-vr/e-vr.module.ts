import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EVRComponent } from './e-vr.component';
import { NotFoundComponent } from '../miscellaneous/not-found/not-found.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NbInputModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';
import { NbIconModule } from '@nebular/theme';
import { NbSelectModule } from '@nebular/theme';
import { NbCardModule } from '@nebular/theme';

import { DashboardComponent } from '../e-vr/dashboard/dashboard.component';
import { WorkspaceComponent } from '../e-vr/workspace/workspace.component';
import { ModeratorGuard } from '../../@core/shared/guards/moderator.guard';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

import { NbThemeModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { SignatureDialogComponent } from './signature-dialog/signature-dialog.component';

import { SignaturePadModule } from 'angular2-signaturepad';
import { UploadComponent } from './upload/upload.component';

import { NbDialogModule } from '@nebular/theme';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomActionComponent } from './custom-action/custom-action.component';
import { VrListconfirmationComponent } from './vr-listconfirmation/vr-listconfirmation.component';

const routes: Routes = [{
  path: '',
  component: EVRComponent,
  children: [
    { path: 'dashboard', canActivate: [ModeratorGuard], component: DashboardComponent},
    { path: 'workspace', component: WorkspaceComponent},
    { path: '', redirectTo: 'workspace', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
  ],
}];

@NgModule({
    declarations: [
        EVRComponent,
        DashboardComponent,
        WorkspaceComponent,
        DeleteConfirmationComponent,
        SignatureDialogComponent,
        UploadComponent,
        CustomActionComponent,
        VrListconfirmationComponent,
    ],
    exports: [RouterModule],
    imports: [
        NbThemeModule,
        NbDialogModule,
        Ng2SmartTableModule,
        ThemeModule,
        CommonModule,
        NbSelectModule,
        NbCardModule,
        NbInputModule,
        FormsModule,
        NbIconModule,
        NbButtonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        SignaturePadModule,
    ]
})
export class EVRModule { }
