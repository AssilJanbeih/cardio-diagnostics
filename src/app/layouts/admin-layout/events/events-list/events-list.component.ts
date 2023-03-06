import { MatSnackBar } from "@angular/material/snack-bar";
import { EventService } from "../../../../services/event.service";
import { ExcelService } from "../../../../services/excel.service";
import { DisplayedColumns } from "../../../../shared/table/table.component";
import { Component, OnInit } from "@angular/core";
import { Event } from "../../../../models/event";
import { MatDialog } from "@angular/material/dialog";

import * as firebase from "firebase/firestore";
import { AuthUser } from "src/app/models/authUser.model";
import { AuthService } from "src/app/services/auth.service";
import { async } from "rxjs";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { EventFormComponent } from "../event-form/event-form.component";

@Component({
  selector: "app-events-list",
  templateUrl: "./events-list.component.html",
  styleUrls: ["./events-list.component.scss"],
})
export class EventsListComponent implements OnInit {
  columns: DisplayedColumns<Event>[] = [
    {
      columnDef: "value",
      header: "Type",
      cell: (element: Event) => `${element.type}`,
    },
    {
      columnDef: "heartRate",
      header: "Heart Rate (BPM)",
      cell: (element: Event) => `${element.heartRate}`,
    },
    {
      columnDef: "createdBy",
      header: "Created By",
      cell: (element: Event) => `${element.createdBy}`,
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
  events: Event[] = [];
  canEdit: boolean = false;
  canDelete: boolean = false;
  localEventService: EventService;
  user: AuthUser;
  startDate: Date;
  endDate: Date;
  constructor(
    private readonly excelService: ExcelService,
    private readonly eventService: EventService,
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
    this.eventService.getEvents().subscribe((data) => {
      // debugger;
      this.eventService.setEventsData(data);
      this.events = this.eventService.events$.getValue();
    });
    this.localEventService = this.eventService;
  }

  exportCSV2() {
    let array_of_ata: any[] = [];
    for (let i = 0; i < this.events.length; i++) {
      array_of_ata.push({
        device_id: this.events[i]["deviceId"]["deviceId"],
        device_name: this.events[i]["deviceName"],
        customer_name: this.events[i]["customerName"],
        customer_uniq_id: this.events[i]["customerUniqueId"],
        date_created: new firebase.Timestamp(
          this.events[i].dateCreated.seconds,
          this.events[i].dateCreated.nanoseconds
        )
          .toDate()
          .toDateString(),
        event_id: this.events[i]["eventId"],
        type: this.events[i]["type"],
        created_by: this.events[i]["createdBy"],
        heart_rate: this.events[i]["heartRate"],
        updated_by: this.events[i]["updatedBy"],
        updated_at: this.events[i]["updatedAt"],
      });
    }

    this.excelService.exportExcel(array_of_ata, "events");
  }

  openAddEvent() {
    this.dialog.open(EventFormComponent, { width: "800px", data: null });
  }

  deleteAllEvents() {
    this.excelService.exportExcel(this.eventService.events, "events");
    let query = this.afs.collection("events").ref.get();
    query.then((doc) => {
      doc.forEach((docList) => {
        docList.ref.delete();
      });
    });
  }

  editEvent(event: Event) {
    this.dialog.open(EventFormComponent, { width: "800px", data: event });
  }

  deleteEvent(event: Event) {
    this.eventService.deleteEvent(event.id).subscribe(
      () => {
        let eventList = this.eventService.events;
        const eventIndex = eventList.findIndex(
          (elt) => elt.id == event.id
        );
        eventList = eventList.splice(eventIndex, 1);
        this.eventService.setEventsData(eventList);
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
      this.events = [];
      console.log(this.startDate, this.endDate, "date");
      let start = new Date(this.startDate);
      let end = new Date(this.endDate);
      this.eventService.getEventsByFromTo(start, end).subscribe((data) => {
        this.eventService.setEventsData(data);
        this.events = this.eventService.events$.getValue();
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
    this.eventService.getEvents().subscribe((data) => {
      // debugger;
      this.eventService.setEventsData(data);
      this.events = this.eventService.events$.getValue();
    });
  }
}
