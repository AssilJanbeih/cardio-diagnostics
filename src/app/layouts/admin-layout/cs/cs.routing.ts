import { CsListComponent } from "./cs-list/cs-list.component";

import { Routes } from "@angular/router";
import { CsComponent } from "./css/cs.component";

export const CsRoutes: Routes = [
  {
    path: "",
    component: CsComponent,
    children: [{ path: "", component: CsListComponent }],
  },
];
