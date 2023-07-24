import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { DocumentVerificationComponent } from './document-verification.component';
import { CustomActionComponent } from './custom-action/custom-action.component';

@NgModule({
  declarations: [ DocumentVerificationComponent, CustomActionComponent ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbIconModule,
    NbTooltipModule
  ]
})
export class DocumentVerificationModule { }
