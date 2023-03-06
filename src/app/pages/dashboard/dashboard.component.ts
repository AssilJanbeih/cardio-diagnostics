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
import { EventService } from "src/app/services/event.service";
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
  customerTotal = 0
  EventsTotal = 0;

  //Filter
  startDate: Date;
  startDateString: String;
  endDate: Date;

  customerFilteredTotal: any;
  eventsFilteredTotal: any;

  add_new_customer: string;
  user: AuthUser;

  constructor(
    public afs: AngularFirestore,
    public invoicesSerice: EventService,
    private readonly _snackBar: MatSnackBar,
    private readonly activatedRoute: ActivatedRoute,

    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this.customerFilteredTotal = 0;
    this.eventsFilteredTotal = 0;
    this.user = this.authService.user$.getValue();
    let query_invoices = this.afs.collection("events");
    query_invoices.get().subscribe((docList_1) => {
      docList_1.forEach((doc) => {
        // let invoice_data = doc.data();
        this.EventsTotal = docList_1.size;
    
      });
    });

    let queryCustomer = this.afs.collection("customers");
    queryCustomer.get().subscribe((docList) => {
      this.customerTotal = docList.size;
    });
  }

  search() {
    if (this.startDate && this.endDate) {
      this.customerFilteredTotal = 0;
      this.eventsFilteredTotal = 0;
      console.log(this.startDate, this.endDate, "date");
      let start = new Date(this.startDate);
      let end = new Date(this.endDate);
      let queryCards = this.afs.collection("events", (ref) =>
        ref.where("dateCreated", ">=", start).where("dateCreated", "<=", end)
      );
      let queryCustomers = this.afs.collection("customers", (ref) =>
        ref.where("dateCreated", ">=", start).where("dateCreated", "<=", end)
      );
      queryCustomers.get().subscribe((docList) => {
        this.customerFilteredTotal = docList.size;
      });
      queryCards.get().subscribe((docList) => {
        this.eventsFilteredTotal = docList.size;
        // docList.forEach((doc) => {
        //   let data = doc.data();
        // });
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
    this.eventsFilteredTotal = 0;
    this.startDate = null;
    this.endDate = null;
  }

  openAddCustomer() {
    this.dialog.open(CustomerFormComponent, { width: "800px", data: null });
  }
}
