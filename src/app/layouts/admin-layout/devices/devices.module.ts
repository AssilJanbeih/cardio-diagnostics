import { RouterModule } from "@angular/router";
import { UsersRoutes } from "./devices.routing";
import { SharedModule } from "../../../shared/shared.module";
import { NgModule } from "@angular/core";
import { DevicesComponent } from "./devices/devices.component";
import { DevicesListComponent } from "./devices-list/devices-list.component";
import { AddDeviceFormComponent } from "./add-device-form/add-device-form";

@NgModule({
  declarations: [
    DevicesComponent,
    AddDeviceFormComponent,
    DevicesListComponent,
  ],
  imports: [RouterModule.forChild(UsersRoutes), SharedModule],
})
export class DevicesMdule {}
