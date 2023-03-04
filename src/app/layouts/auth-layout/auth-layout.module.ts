import { SharedModule } from "./../../shared/shared.module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthLayoutRoutes } from "./auth-layout.routing";
import { LoginComponent } from "../../pages/login/login.component";
@NgModule({
  imports: [RouterModule.forChild(AuthLayoutRoutes), SharedModule],
  declarations: [LoginComponent],
})
export class AuthLayoutModule {}
