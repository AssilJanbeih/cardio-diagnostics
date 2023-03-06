import { ExcelService } from "src/app/services/excel.service";
import { Event } from "src/app/models/event";
import * as firebase from "firebase/firestore";
import { EventService } from "src/app/services/event.service";
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
  eventsTotal: number = 0;
  customer: Customer;
  event: Event;
  canEdit = true;
  user: AuthUser;
  canDelete = true;
  events: Event[];
  events_data: any[] = [];
  columns: DisplayedColumns<Event>[] = [
    {
      columnDef: "store",
      header: "Device Name",
      cell: (element: Event) => `${element.deviceName}`,
    },
    {
      columnDef: "heartRate",
      header: "Heart Rate (BPM)",
      cell: (element: Event) => `${element.heartRate}`,
    },
    {
      columnDef: "type",
      header: "Event Type",
      cell: (element: Event) => `${element.type}`,
    },
    {
      columnDef: "createdBy",
      header: "Creatd By",
      cell: (element: Event) =>
        `${element.createdBy ? element.createdBy : ""}`,
    },
    {
      columnDef: "dateCreated",
      header: "Date Created",
      cell: (element: Event) =>
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
      cell: (element: Event) => ``,
    },
  ];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly customerService: CustomerService,
    private readonly excelService: ExcelService,
    public dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly _snackBar: MatSnackBar,
    private readonly eventsService: EventService,
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

            let query_customers_events = this.afs.collection(
              "events",
              (ref) => ref.where("customerId", "==", this.customer.id)
            );
            query_customers_events.get().subscribe((docList) => {
              docList.forEach((doc) => {
                let event_data = doc.data();
                this.eventsTotal = docList.size;
              });
              
            });
            return this.eventsService.getEventsByCustomer(this.customer.id);
          })
        )
        .subscribe((data) => {
          this.events = data;
        });
    });
  }
  getStatistic() {
    let event: Event = {
      id: "",
      customerName:
        this.customer.firstName + " " + this.customer.lastName
          ? this.customer.firstName + " " + this.customer.lastName
          : "",
          
      heartRate: null,
      type: null,
      dateCreated: new Date(),
      eventId: "",
      createdBy: "",
      updatedBy: "",
      updatedAt: "",
      deviceName: "",
      customerId: this.customer.id ? this.customer.id : "",
      customerUniqueId: this.customer.customerId
        ? this.customer.customerId
        : "", 
    };
    this.dialog.open(EventFormComponent, {
      width: "800px",
      data: event,
    });
  }
  openAddEvent() {
    this.dialog.open(EventFormComponent, { width: "800px", data: null });
  }
  editCustomer() {
    this.dialog.open(CustomerFormComponent, {
      width: "800px",
      data: this.customer,
    });
  }
  editEvent(event: Event) {
    this.dialog.open(EventFormComponent, { width: "800px", data: event });
  }
  deleteEvent(event: Event) {
    this.eventsService.deleteEvent(event.id).subscribe(
      () => {
        let eventList = this.eventsService.events;
        const eventIndex = eventList.findIndex(
          (elt) => elt.id == event.id
        );
        eventList = eventList.splice(eventIndex, 1);
        this.eventsService.setEventsData(eventList);
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
    this.events = this.events.map((elt) => {
      return {
        ...elt,
        full_name: this.customer.firstName + " " + this.customer.lastName,
        phone: this.customer.phone,
        nationality: this.customer.nationality,
        email: this.customer.email,
        gender: this.customer.gender,
        age: this.customer.age,
        TotalEvents: this.eventsTotal,
      };
    });
    this.excelService.exportExcel(this.events, "Patients");
  }
}
