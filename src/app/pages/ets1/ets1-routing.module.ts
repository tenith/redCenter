import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Ets1Component } from "./ets1.component";
import { WorkspaceComponent } from "./workspace/workspace.component";

const routes: Routes = [
  {
    path: "",
    component: Ets1Component,
    children: [
      { path: "workspace", component: WorkspaceComponent },
      { path: "", redirectTo: "workspace", pathMatch: "full" },
      { path: "**", component: WorkspaceComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Ets1RoutingModule {}
