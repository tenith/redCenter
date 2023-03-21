import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizationRoutingModule } from './authorization-routing.module';
import { AuthorizationComponent } from './authorization.component';

import { NbThemeModule, NbLayoutModule, NbIconModule, NbButtonModule, NbCardModule } from '@nebular/theme';
import { RoleComponent } from './role/role.component';
import { RoleConfirmationComponent } from './role-confirmation/role-confirmation.component';

@NgModule({
  declarations: [
    AuthorizationComponent,
    RoleComponent,
    RoleConfirmationComponent
  ],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    NbThemeModule,
    NbLayoutModule,
    NbIconModule,
    NbCardModule,
    NbButtonModule
  ]
})
export class AuthorizationModule { }
