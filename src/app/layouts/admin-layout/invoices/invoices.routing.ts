import { InvoicesListComponent } from "./invoices-list/invoices-list.component";
import { InvoicesComponent } from "./invoices/invoices.component";
import { Routes } from "@angular/router";

export const InvoicesRoutes: Routes = [
  {
    path: "",
    component: InvoicesComponent,
    children: [{ path: "", component: InvoicesListComponent }],
  },
];
