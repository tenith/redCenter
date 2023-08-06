import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "../pages/miscellaneous/not-found/not-found.component";
import { AuthorizationComponent } from "./authorization.component";
import { RoleComponent } from "./role/role.component";

const routes: Routes = [
  {
    path: "",
    component: AuthorizationComponent,
    children: [
      { path: "role", component: RoleComponent },
      { path: "", redirectTo: "role", pathMatch: "full" },
      { path: "**", component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizationRoutingModule {}
