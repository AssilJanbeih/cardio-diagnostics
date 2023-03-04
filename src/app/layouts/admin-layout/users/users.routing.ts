import { UsersListComponent } from "./users-list/users-list.component";

import { Routes } from "@angular/router";
import { UsersComponent } from "./users/users.component";

export const UsersRoutes: Routes = [
  {
    path: "",
    component: UsersComponent,
    children: [{ path: "", component: UsersListComponent }],
  },
];
