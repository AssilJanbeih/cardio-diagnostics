import { InvoicesComponent } from "./invoices/invoices/invoices.component";
import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";
import { StoresComponent } from "src/app/layouts/admin-layout/stores/stores/stores.component";
import { CustomerFormComponent } from "./customers/customer-form/customer-form.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "profile", component: UserProfileComponent },

  {
    path: "invoices",
    loadChildren: () =>
      import("src/app/layouts/admin-layout/invoices/invoices.module").then(
        (m) => m.InvoicesModule
      ),
  },

  {
    path: "campaigns",
    loadChildren: () =>
      import("src/app/layouts/admin-layout/camp/camps.module").then(
        (m) => m.CampsModule
      ),
  },
  // {
  //   path: "customers/default",
  //   loadChildren: () =>
  //     import(
  //       "src/app/layouts/admin-layout/DefaultCustomers/customers.module"
  //     ).then((m) => m.CustomersModule),
  // },

  {
    path: "shopandwincustomers",
    loadChildren: () =>
      import("src/app/layouts/admin-layout/customers/customers.module").then(
        (m) => m.CustomersModule
      ),
  },
  {
    path: "admins",
    loadChildren: () =>
      import("src/app/layouts/admin-layout/users/users.module").then(
        (m) => m.UsersModule
      ),
  },
  {
    path: "cs",
    loadChildren: () =>
      import("src/app/layouts/admin-layout/cs/cs.module").then(
        (m) => m.CsModule
      ),
  },
  {
    path: "stores",
    loadChildren: () =>
      import("src/app/layouts/admin-layout/stores/stores.module").then(
        (m) => m.StoreModule
      ),
  },
];
