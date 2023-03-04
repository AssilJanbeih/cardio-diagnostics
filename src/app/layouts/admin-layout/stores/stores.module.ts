import { RouterModule } from "@angular/router";
import { UsersRoutes } from "./stores.routing";
import { SharedModule } from "../../../shared/shared.module";
import { NgModule } from "@angular/core";
import { StoresComponent } from "./stores/stores.component";
import { StoresListComponent } from "./stores-list/stores-list.component";
import { AddStoreFormComponent } from "./add-store-form/add-store-form";

@NgModule({
  declarations: [StoresComponent, AddStoreFormComponent, StoresListComponent],
  imports: [RouterModule.forChild(UsersRoutes), SharedModule],
})
export class StoreModule {}
