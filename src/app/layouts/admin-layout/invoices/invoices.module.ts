import { SharedModule } from "./../../../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoicesListComponent } from "./invoices-list/invoices-list.component";
import { InvoicesComponent } from "./invoices/invoices.component";
import { RouterModule } from "@angular/router";
import { InvoicesRoutes } from "./invoices.routing";
import { InvoiceFormComponent } from "./invoice-form/invoice-form.component";

@NgModule({
  declarations: [
    InvoicesListComponent,
    InvoicesComponent,
    InvoiceFormComponent,
    InvoicesComponent,
  ],
  imports: [RouterModule.forChild(InvoicesRoutes), SharedModule],
})
export class InvoicesModule {}
