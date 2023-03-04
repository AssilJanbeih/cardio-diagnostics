import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../services/auth.service";
import { query } from "firebase/firestore";
import { Component, OnInit, ViewChild } from "@angular/core";
import Chart from "chart.js";
// core components

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "../../variables/charts";
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  SwiperOptions,
} from "swiper";
import { SwiperComponent } from "swiper/angular";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthUser } from "src/app/models/authUser.model";
import { InvoiceService } from "src/app/services/invoice.service";
import { FormGroup } from "@angular/forms";
import { CustomerFormComponent } from "src/app/layouts/admin-layout/customers/customer-form/customer-form.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CustomerService } from "src/app/services/customer.service";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

import { DatePipe } from "@angular/common";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  providers: [DatePipe],
})
export class DashboardComponent implements OnInit {
  customerTotal = 0;
  // customerPrivilege = 0;
  // customerRegular = 0;
  totalCoupons = 0;
  InvoicesTotal = 0;
  totalOverHead = 0;
  invoicesTotal = 0;
  labelsTotal = 0;
  value_sum = 0;
  overhead_sum = 0;
  labelValue = 0;
  totalSalesValue = 0.00;
  campValue = 0 ;
  // totalLabels = 0;
  //Filter
  startDate: Date;
  startDateString: String;
  endDate: Date;

  customerFilteredTotal: any;
  invoicesFilteredTotal: any;
  invoicesValueFilterTotal: any;
  labelsFilteredTotal: any;
  labelsValueFilterTotal: any;
  overheadValueFilterTotal: any;

  add_new_customer: string;
  user: AuthUser;

  constructor(
    public afs: AngularFirestore,
    public invoicesSerice: InvoiceService,
    private readonly _snackBar: MatSnackBar,
    private readonly activatedRoute: ActivatedRoute,

    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this.customerFilteredTotal = 0;
    this.invoicesFilteredTotal = 0;
    this.invoicesValueFilterTotal = 0;
    this.labelsFilteredTotal = 0;
    this.campValue = 0;
    this.labelsValueFilterTotal = 0;
    this.overheadValueFilterTotal = 0;
    this.user = this.authService.user$.getValue();
    let query_invoices = this.afs.collection("invoices");
    query_invoices.get().subscribe((docList_1) => {
      this.invoicesTotal = docList_1.size;
      docList_1.forEach((doc) => {

        let invoice_data = doc.data();
        this.campValue = invoice_data["campId"]["alfa"];

        this.InvoicesTotal = docList_1.size;
        this.totalSalesValue += Math.round(invoice_data["amount"]*100)/100;
        this.totalCoupons += Math.floor(
          invoice_data["amount"] / this.campValue
        );        
      });
      this.labelValue = this.totalCoupons * this.campValue;
      this.totalOverHead = this.totalSalesValue - this.labelValue;
    });

    let queryCustomer = this.afs.collection("customers");
    queryCustomer.get().subscribe((docList) => {
      this.customerTotal = docList.size;
    });
  }

  search() {
    if (this.startDate && this.endDate) {
      this.customerFilteredTotal = 0;
      this.invoicesValueFilterTotal = 0.00;
      this.invoicesFilteredTotal = 0;
      this.labelsFilteredTotal = 0;
      this.labelsValueFilterTotal = 0;
      this.overheadValueFilterTotal = 0;
      console.log(this.startDate, this.endDate, "date");
      let start = new Date(this.startDate);
      let end = new Date(this.endDate);
      let queryCards = this.afs.collection("invoices", (ref) =>
        ref.where("dateCreated", ">=", start).where("dateCreated", "<=", end)
      );
      let queryCustomers = this.afs.collection("customers", (ref) =>
        ref.where("dateCreated", ">=", start).where("dateCreated", "<=", end)
      );
      queryCustomers.get().subscribe((docList) => {
        this.customerFilteredTotal = docList.size;
      });
      queryCards.get().subscribe((docList) => {
        this.invoicesFilteredTotal = docList.size;
        docList.forEach((doc) => {
          let data = doc.data();
          this.campValue = data["campId"]["alfa"];
          this.invoicesValueFilterTotal += Math.round(data["amount"]*100)/100;
          
          this.labelsFilteredTotal += Math.floor(
             data["amount"] / this.campValue
          );
  
        });
        this.labelsValueFilterTotal = this.labelsFilteredTotal * this.campValue;
        this.overheadValueFilterTotal = this.invoicesValueFilterTotal - this.labelsValueFilterTotal;
      });
    } else {
      this._snackBar.open("Please add start date and end to", "X", {
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    }
  }

  reset() {
    this.customerFilteredTotal = 0;
    this.invoicesFilteredTotal = 0;
    this.invoicesValueFilterTotal = 0;
    this.labelsFilteredTotal = 0;
    this.labelsValueFilterTotal = 0;
    this.overheadValueFilterTotal = 0;
    this.startDate = null;
    this.endDate = null;
  }

  openAddCustomer() {
    this.dialog.open(CustomerFormComponent, { width: "800px", data: null });
  }
}
