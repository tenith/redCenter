import { NgModule } from "@angular/core";
import { NbButtonModule, NbCardModule } from "@nebular/theme";

import { ThemeModule } from "../../@theme/theme.module";
import { MiscellaneousRoutingModule } from "./miscellaneous-routing.module";
import { MiscellaneousComponent } from "./miscellaneous.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ForbiddenComponent } from "./forbidden/forbidden.component";
import { OfflineComponent } from "./offline/offline.component";

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    MiscellaneousRoutingModule,
  ],
  declarations: [
    MiscellaneousComponent,
    NotFoundComponent,
    ForbiddenComponent,
    OfflineComponent,
  ],
  exports: [OfflineComponent],
})
export class MiscellaneousModule {}
