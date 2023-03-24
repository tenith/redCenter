import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationComponent } from './authorization.component';

import { NbCardModule, NbIconModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';
import { NbInputModule } from '@nebular/theme';
import { NbTooltipModule } from '@nebular/theme';
import { NbRadioModule } from '@nebular/theme';
import { NbSelectModule } from '@nebular/theme';
import { NbToastrModule } from '@nebular/theme';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AuthorizationComponent
  ],
  imports: [
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
export class AuthorizationModule { }
