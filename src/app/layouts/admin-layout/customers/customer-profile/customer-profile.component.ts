import { ExcelService } from "src/app/services/excel.service";
import { Invoice } from "src/app/models/invoice";
import * as firebase from "firebase/firestore";
import { InvoiceService } from "src/app/services/invoice.service";
import { switchMap } from "rxjs";
import { CustomerService } from "src/app/services/customer.service";
import { Customer } from "src/app/models/customer";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { DisplayedColumns } from "src/app/shared/table/table.component";

import { MatDialog } from "@angular/material/dialog";
import { CustomerFormComponent } from "../customer-form/customer-form.component";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "src/app/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthUser } from "src/app/models/authUser.model";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { EventFormComponent } from "../../events/event-form/event-form.component";

@Component({
  selector: "app-customer-profile",
  templateUrl: "./customer-profile.component.html",
  styleUrls: ["./customer-profile.component.scss"],
})
export class CustomerProfileComponent implements OnInit {
  valueTotal: number = 0;
  InvoicesTotal: number = 0;
  labelValue: number = 0;
  totalCoupons: number = 0;
  totalSalesValue: number = 0;
  totalOverHead: number = 0;
  totalLabels: number = 0;
  customer: Customer;
  invoice: Invoice;
  canEdit = true;
  user: AuthUser;
  canDelete = true;
  invoices: Invoice[];
  invoices_data: any[] = [];
  columns: DisplayedColumns<Invoice>[] = [
    // {
    //   columnDef: "id",
    //   header: "Invoice ID",
    //   cell: (element: Invoice) => `${element.invoiceId}`,
    // },
    {
      columnDef: "store",
      header: "Device Name",
      cell: (element: Invoice) => `${element.campName}`,
    },
    {
      columnDef: "serialNumber",
      header: "Heart Rate (BPM)",
      cell: (element: Invoice) => `${element.serialNumber}`,
    },
    {
      columnDef: "value",
      header: "Event Type",
      cell: (element: Invoice) => `${element.amount}`,
    },
    {
      columnDef: "createdBy",
      header: "Creatd By",
      cell: (element: Invoice) =>
        `${element.createdBy ? element.createdBy : ""}`,
    },
    {
      columnDef: "dateCreated",
      header: "Date Created",
      cell: (element: Invoice) =>
        `${new firebase.Timestamp(
          element.dateCreated.seconds,
          element.dateCreated.nanoseconds
        )
          .toDate()
          .toDateString()}`,
    },
    {
      columnDef: "actions",
      header: "Actions",
      cell: (element: Invoice) => ``,
    },
  ];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly customerService: CustomerService,
    private readonly excelService: ExcelService,
    public dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly _snackBar: MatSnackBar,
    private readonly invoiceService: InvoiceService,
    public afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user$.getValue();
    this.activatedRoute.params.subscribe((data) => {
      const customerId = data.customerId as string;
      this.customerService
        .getCustomerById(customerId)
        .pipe(
          switchMap((data) => {
            this.customer = data as Customer;

            let query_customers_invoices = this.afs.collection(
              "invoices",
              (ref) => ref.where("customerId", "==", this.customer.id)
            );
            query_customers_invoices.get().subscribe((docList) => {
              this.totalCoupons = 0;
              this.totalOverHead = 0;
              this.totalSalesValue = 0;
              this.labelValue = 0;
              this.valueTotal = 0;
              docList.forEach((doc) => {
                let invoice_data = doc.data();
                console.log(invoice_data["amount"]); //////////Edited here : was amount
                this.InvoicesTotal = docList.size;
                this.totalSalesValue =
                  this.totalSalesValue + invoice_data["amount"]; //////////Edited here : was amount
                this.totalCoupons = Math.floor(
                  this.totalSalesValue / invoice_data["campId"]["alfa"]
                );
                this.labelValue =
                  this.totalCoupons * invoice_data["campId"]["alfa"];
                this.totalLabels = this.totalLabels + invoice_data["label"];
              });
              this.totalOverHead = this.totalSalesValue - this.labelValue;
            });
            this.totalCoupons = 0;
            this.totalOverHead = 0;
            this.totalSalesValue = 0;
            this.valueTotal = 0;
            return this.invoiceService.getInvoicesByCustomer(this.customer.id);
          })
        )
        .subscribe((data) => {
          this.invoices = data;
        });
    });
  }
  getStatistic() {
    let invoice: Invoice = {
      id: "",
      customerName:
        this.customer.firstName + " " + this.customer.lastName
          ? this.customer.firstName + " " + this.customer.lastName
          : "",
      storeName: "",
      ////////////Edited here removed value: null,

      label: null,
      serialNumber: null,
      salesValue: null,
      campValue: null,
      dateCreated: new Date(),
      invoiceId: "",
      createdBy: "",
      updatedBy: "",
      updatedAt: "",
      campName: "",
      customerId: this.customer.id ? this.customer.id : "",
      customerUniqueId: this.customer.customerId
        ? this.customer.customerId
        : "", //////////Edited here : added unique id
    };

    this.dialog.open(EventFormComponent, {
      width: "800px",
      data: invoice,
    });
  }
  openAddInvoice() {
    this.dialog.open(EventFormComponent, { width: "800px", data: null });
  }
  editCustomer() {
    this.dialog.open(CustomerFormComponent, {
      width: "800px",
      data: this.customer,
    });
  }
  editInvoice(invoice: Invoice) {
    this.dialog.open(EventFormComponent, { width: "800px", data: invoice });
    // this.dialog.open(GiftCardComponent, { width: "800px", data: invoice });
  }
  deleteInvoice(invoice: Invoice) {
    this.invoiceService.deleteInvoice(invoice.id).subscribe(
      () => {
        let invoiceList = this.invoiceService.invoices;
        const invoiceIndex = invoiceList.findIndex(
          (elt) => elt.id == invoice.id
        );
        invoiceList = invoiceList.splice(invoiceIndex, 1);
        this.invoiceService.setInvoicesData(invoiceList);
      },
      (error) => {
        this._snackBar.open(error, "X", {
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      }
    );
  }
  exportCSV() {
    this.invoices = this.invoices.map((elt) => {
      return {
        ...elt,
        full_name: this.customer.firstName + " " + this.customer.lastName,
        phone: this.customer.phone,
        nationality: this.customer.nationality,
        email: this.customer.email,
        gender: this.customer.gender,
        age: this.customer.age,
        totalOverHead: this.totalOverHead,
        totalSalesValue: this.totalSalesValue,
        totalCoupons: this.totalCoupons,
        TotalGiftCards: this.InvoicesTotal,
      };
    });
    this.excelService.exportExcel(this.invoices, "Patients");
  }
}
