import { SharedModule } from "../../../shared/shared.module";
import { NgModule } from "@angular/core";
import { CustomersListComponent } from "./customers-list/customers-list.component";
import { CustomersComponent } from "./customers/customers.component";
import { RouterModule } from "@angular/router";
import { CustomersRoutes } from "./customers.routing";
import { CustomerFormComponent } from "./customer-form/customer-form.component";
import { StatisticsFormComponent } from "./statistics-form/statistics-form.component";
import { CustomerProfileComponent } from "./customer-profile/customer-profile.component";

@NgModule({
  declarations: [
    CustomersListComponent,
    CustomersComponent,
    CustomerProfileComponent,
    CustomerFormComponent,
    StatisticsFormComponent,
  ],
  imports: [RouterModule.forChild(CustomersRoutes), SharedModule],
})
export class CustomersModule {}
