import { MatSnackBar } from "@angular/material/snack-bar";
import { InvoiceService } from "../../../../services/invoice.service";
import { ExcelService } from "../../../../services/excel.service";
import { DisplayedColumns } from "../../../../shared/table/table.component";
import { Component, OnInit } from "@angular/core";
import { Invoice } from "../../../../models/invoice";
import { MatDialog } from "@angular/material/dialog";

import * as firebase from "firebase/firestore";
import { AuthUser } from "src/app/models/authUser.model";
import { AuthService } from "src/app/services/auth.service";
import { async } from "rxjs";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { EventFormComponent } from "../event-form/event-form.component";

@Component({
  selector: "app-invoices-list",
  templateUrl: "./events-list.component.html",
  styleUrls: ["./events-list.component.scss"],
})
export class EventsListComponent implements OnInit {
  columns: DisplayedColumns<Invoice>[] = [
    {
      columnDef: "value",
      header: "Type",
      cell: (element: Invoice) => `${element.amount}`,
    },
    {
      columnDef: "serialNumber",
      header: "Heart Rate (BPM)",
      cell: (element: Invoice) => `${element.serialNumber}`,
    },
    {
      columnDef: "createdBy",
      header: "Created By",
      cell: (element: Invoice) => `${element.createdBy}`,
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
  invoices: Invoice[] = [];
  canEdit: boolean = false;
  canDelete: boolean = false;
  localInvoiceService: InvoiceService;
  user: AuthUser;
  startDate: Date;
  endDate: Date;
  constructor(
    private readonly excelService: ExcelService,
    private readonly invoiceService: InvoiceService,
    private readonly authService: AuthService,
    private readonly _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private readonly afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user$.getValue();

    this.canEdit = true;
    this.canDelete = true;
    if (this.user.role) {
      this.canDelete = false;
    }
    this.invoiceService.getInvoices().subscribe((data) => {
      // debugger;
      this.invoiceService.setInvoicesData(data);
      this.invoices = this.invoiceService.invoices$.getValue();
    });
    this.localInvoiceService = this.invoiceService;
  }

  exportCSV2() {
    let array_of_ata: any[] = [];
    for (let i = 0; i < this.invoices.length; i++) {
      array_of_ata.push({
        camp_id: this.invoices[i]["campId"]["campId"],
        camp_name: this.invoices[i]["campName"],
        camp_value: this.invoices[i]["campValue"],
        customer_name: this.invoices[i]["customerName"],
        customer_uniq_id: this.invoices[i]["customerUniqueId"],
        date_created: new firebase.Timestamp(
          this.invoices[i].dateCreated.seconds,
          this.invoices[i].dateCreated.nanoseconds
        )
          .toDate()
          .toDateString(),
        invoice_id: this.invoices[i]["invoiceId"],
        amount: this.invoices[i]["amount"],
        overhead: this.invoices[i]["overhead"],
        created_by: this.invoices[i]["createdBy"],
        serial_number: this.invoices[i]["serialNumber"],
        store_name: this.invoices[i]["storeName"],
        updated_by: this.invoices[i]["updatedBy"],
        updated_at: this.invoices[i]["updatedAt"],
      });
    }

    this.excelService.exportExcel(array_of_ata, "events");
  }

  openAddInvoice() {
    this.dialog.open(EventFormComponent, { width: "800px", data: null });
  }

  deleteAllInvoices() {
    this.excelService.exportExcel(this.invoiceService.invoices, "events");
    let query = this.afs.collection("events").ref.get();
    query.then((doc) => {
      doc.forEach((docList) => {
        docList.ref.delete();
      });
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
  search() {
    if (this.startDate && this.endDate) {
      this.invoices = [];
      console.log(this.startDate, this.endDate, "date");
      let start = new Date(this.startDate);
      let end = new Date(this.endDate);
      this.invoiceService.getInvoicesByFromTo(start, end).subscribe((data) => {
        this.invoiceService.setInvoicesData(data);
        this.invoices = this.invoiceService.invoices$.getValue();
      });
    } else {
      this._snackBar.open("Please add start date and end to", "X", {
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    }
  }
  reset() {
    this.startDate = null;
    this.endDate = null;
    this.invoiceService.getInvoices().subscribe((data) => {
      // debugger;
      this.invoiceService.setInvoicesData(data);
      this.invoices = this.invoiceService.invoices$.getValue();
    });
  }
}
