import { RouterModule } from "@angular/router";
import { UsersRoutes } from "./users.routing";
import { SharedModule } from "./../../../shared/shared.module";
import { NgModule } from "@angular/core";
import { UsersComponent } from "./users/users.component";
import { UsersListComponent } from "./users-list/users-list.component";
import { AddUserFormComponent } from "./add-user-form/add-user-form";

@NgModule({
  declarations: [UsersComponent, UsersListComponent, AddUserFormComponent],
  imports: [RouterModule.forChild(UsersRoutes), SharedModule],
})
export class UsersModule {}
