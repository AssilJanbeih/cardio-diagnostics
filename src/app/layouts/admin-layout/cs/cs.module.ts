import { RouterModule } from "@angular/router";
import { CsRoutes } from "./cs.routing";
import { SharedModule } from "../../../shared/shared.module";
import { NgModule } from "@angular/core";
import { CsComponent } from "./css/cs.component";
import { CsListComponent } from "./cs-list/cs-list.component";
import { AddCsFormComponent } from "./add-cs-form/add-cs-form";

@NgModule({
  declarations: [CsComponent, CsListComponent, AddCsFormComponent],
  imports: [RouterModule.forChild(CsRoutes), SharedModule],
})
export class CsModule {}
