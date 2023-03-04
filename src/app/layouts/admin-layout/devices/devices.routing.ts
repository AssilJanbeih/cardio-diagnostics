import { DevicesListComponent } from "./devices-list/devices-list.component";
import { Routes } from "@angular/router";
import { DevicesComponent } from "./devices/devices.component";

export const UsersRoutes: Routes = [
  {
    path: "",
    component: DevicesComponent,
    children: [{ path: "", component: DevicesListComponent }],
  },
];
