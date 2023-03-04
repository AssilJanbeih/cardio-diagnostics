import { StoresListComponent } from "./stores-list/stores-list.component";

import { Routes } from "@angular/router";
import { StoresComponent } from "./stores/stores.component";

export const UsersRoutes: Routes = [
  {
    path: "",
    component: StoresComponent,
    children: [{ path: "", component: StoresListComponent }],
  },
];
