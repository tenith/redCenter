import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ets1RoutingModule } from './ets1-routing.module';
import { Ets1Component } from './ets1.component';

import { NbTabsetModule } from '@nebular/theme';
import { WorkspaceComponent } from './workspace/workspace.component';

import { NbIconModule } from '@nebular/theme';
import { DashboardComponent } from './dashboard/dashboard.component';

import { NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomActionComponent } from './custom-action/custom-action.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { ETS1FormComponent } from './e-ts1-form/e-ts1-form.component';

import { NbButtonModule } from '@nebular/theme';

import { FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';


@NgModule({
  declarations: [
    Ets1Component,
    WorkspaceComponent,
    DashboardComponent,
    CustomActionComponent,
    DeleteConfirmationComponent,
    ETS1FormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPrintModule,
    NbCardModule,
    Ets1RoutingModule,
    NbTabsetModule,
    NbIconModule,
    Ng2SmartTableModule,
    NbButtonModule,
  ]
})
export class Ets1Module { }
