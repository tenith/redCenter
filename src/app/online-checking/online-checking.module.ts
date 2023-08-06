import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OnlineCheckingRoutingModule } from "./online-checking-routing.module";

import {
  NbThemeModule,
  NbLayoutModule,
  NbIconModule,
  NbButtonModule,
  NbCardModule,
  NbSpinnerModule,
} from "@nebular/theme";
import { RemoteSEPComponent } from "./remote-sep/remote-sep.component";
import { SepModule } from "../pages/sep/sep.module";

@NgModule({
  declarations: [RemoteSEPComponent],
  imports: [
    CommonModule,
    NbThemeModule,
    NbLayoutModule,
    NbIconModule,
    NbButtonModule,
    OnlineCheckingRoutingModule,
    SepModule,
    NbCardModule,
    NbSpinnerModule,
  ],
})
export class OnlineCheckingModule {}
