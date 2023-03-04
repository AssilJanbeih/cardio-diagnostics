import { CustonerProfileResolver } from "./../../../resolvers/custoner-profile.resolver";
import { CustomersListComponent } from "./customers-list/customers-list.component";
import { CustomersComponent } from "./customers/customers.component";
import { Routes } from "@angular/router";
import { CustomerProfileComponent } from "./customer-profile/customer-profile.component";

export const CustomersRoutes: Routes = [
  {
    path: "",
    component: CustomersComponent,
    children: [
      {
        path: "",
        component: CustomersListComponent,
      },
      {
        path: ":customerId",
        component: CustomerProfileComponent,
      },
    ],
  },
];
