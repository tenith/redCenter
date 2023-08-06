import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";

import { NbCardModule } from "@nebular/theme";
import { NbIconModule } from "@nebular/theme";
import { NbAccordionModule } from "@nebular/theme";

import { QRCodeModule } from "angularx-qrcode";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbAccordionModule,
    QRCodeModule,
  ],
})
export class HomeModule {}
