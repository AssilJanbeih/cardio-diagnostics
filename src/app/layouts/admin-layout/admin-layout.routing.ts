import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "profile", component: UserProfileComponent },

  {
    path: "events",
    loadChildren: () =>
      import("src/app/layouts/admin-layout/events/events.module").then(
        (m) => m.EventsModule
      ),
  },

  {
    path: "devices",
    loadChildren: () =>
      import("src/app/layouts/admin-layout/devices/devices.module").then(
        (m) => m.DevicesMdule
      ),
  },

  {
    path: "PatientManagement",
    loadChildren: () =>
      import("src/app/layouts/admin-layout/customers/customers.module").then(
        (m) => m.CustomersModule
      ),
  },
];
