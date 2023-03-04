import { RouterModule } from "@angular/router";
import { UsersRoutes } from "./camps.routing";
import { SharedModule } from "../../../shared/shared.module";
import { NgModule } from "@angular/core";
import { CampsComponent } from "./camps/camps.component";
import { CampsListComponent } from "./camps-list/camps-list.component";
import { AddCampFormComponent } from "./add-camp-form/add-camp-form";

@NgModule({
  declarations: [CampsComponent, AddCampFormComponent, CampsListComponent],
  imports: [RouterModule.forChild(UsersRoutes), SharedModule],
})
export class CampsModule {}
