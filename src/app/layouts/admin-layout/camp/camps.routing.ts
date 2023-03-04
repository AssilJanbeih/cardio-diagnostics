import { CampsListComponent } from "./camps-list/camps-list.component";
import { Routes } from "@angular/router";
import { CampsComponent } from "./camps/camps.component";

export const UsersRoutes: Routes = [
  {
    path: "",
    component: CampsComponent,
    children: [{ path: "", component: CampsListComponent }],
  },
];
