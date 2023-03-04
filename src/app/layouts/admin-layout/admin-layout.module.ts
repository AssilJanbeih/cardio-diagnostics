import { SharedModule } from "./../../shared/shared.module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";

@NgModule({
  imports: [RouterModule.forChild(AdminLayoutRoutes), SharedModule],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    // StoresComponent,
    // StoreFormComponent,
  ],
})
export class AdminLayoutModule {}
