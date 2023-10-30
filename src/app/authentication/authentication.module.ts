import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthenticationRoutingModule } from "./authentication-routing.module";
import { AuthenticationComponent } from "./authentication.component";
import { SigninComponent } from "./signin/signin.component";

import {
  NbThemeModule,
  NbLayoutModule,
  NbIconModule,
  NbButtonModule,
  NbCardModule,
  NbToastrModule,
} from "@nebular/theme";
import { SignoutComponent } from "./signout/signout.component";

@NgModule({
  declarations: [AuthenticationComponent, SigninComponent, SignoutComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    NbThemeModule,
    NbLayoutModule,
    NbIconModule,
    NbButtonModule,
    NbCardModule,
    NbToastrModule,
  ],
})
export class AuthenticationModule {}
