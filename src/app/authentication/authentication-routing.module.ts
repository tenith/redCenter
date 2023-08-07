import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "../pages/miscellaneous/not-found/not-found.component";
import { AuthenticationComponent } from "./authentication.component";
import { SigninComponent } from "./signin/signin.component";
import { SignoutComponent } from "./signout/signout.component";

const routes: Routes = [
  {
    path: "",
    component: AuthenticationComponent,
    children: [
      { path: "signin", component: SigninComponent },
      { path: "signout", component: SignoutComponent, pathMatch: "full" },
      { path: "", redirectTo: "signin", pathMatch: "full" },
      { path: "**", component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
