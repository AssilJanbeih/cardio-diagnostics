import { MatSnackBar } from "@angular/material/snack-bar";
import { UsersService } from "src/app/services/users.service";
import { EventService } from "../../../../services/event.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Component, Inject, OnInit } from "@angular/core";

import { Event } from "src/app/models/event";

import * as firebase from "firebase/firestore";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { Customer } from "src/app/models/customer";

import { CustomerService } from "src/app/services/customer.service";

import { AuthService } from "src/app/services/auth.service";
import { AuthUser } from "src/app/models/authUser.model";
import { Router } from "@angular/router";
import { DevicesService } from "src/app/services/device.service";
import { Device } from "src/app/models/device";

@Component({
  selector: "app-event-form",
  templateUrl: "./event-form.component.html",
  styleUrls: ["./event-form.component.scss"],
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  url: string;
  editMode: boolean;
  user: AuthUser;
  customers: Customer[];
  devices: Device[];
  DeviceData: Device[];
  eventsData: Event[];
  localUserService: UsersService;
  device_array_of_devices = [];

  device_alfa_value = 0;
  events_array_of_id_by_customr: [];
  customer_array = [];
  customers_ids = [];
  authUser: AuthUser;
  deviceId = new FormControl(this.data?.deviceId ? this.data?.deviceId : "");
  heartRate = new FormControl(
    this.data?.heartRate ? this.data?.heartRate : ""
  );
  type = new FormControl(this.data?.type ? this.data?.type : "");
  customerId: string;
  customerUniqueId: string;
  constructor(
    private readonly fb: FormBuilder,
    private readonly eventService: EventService,
    private readonly deviceService: DevicesService,
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
    private readonly _snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly userService: UsersService,
    public dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event
  ) {}

  ngOnInit(): void {
    this.deviceService.getDevicesAll().subscribe((data2) => {
      this.devices = data2;
      this.deviceService.setDevicesData(data2);
    });
    this.eventService.getEvents().subscribe((data) => {
      this.eventService.setEventsData(data);
    });
    this.customerService.getCustomersAll().subscribe((data) => {
      this.customers = data;
      this.customerService.setCustomersData(data);
    });
    this.customerId = this.data?.customerId ? this.data.customerId : "";
    this.customerUniqueId = this.data?.customerUniqueId
      ? this.data.customerUniqueId
      : "";
    this.customer_array = [];
    this.customers_ids = [];
    this.authUser = this.authService.userValue;
    this.localUserService = this.userService;
    this.userService.getUsers().subscribe((data) => {
      this.userService.setUsersData(data);
      this.authUser = this.authService.userValue;
    });
    this.deviceService.getDevices().subscribe((data) => {
      this.DeviceData = data;
      this.deviceService.setDevicesData(data);

      for (let i = 0; i < this.DeviceData.length; i++) {
        if (this.DeviceData[i]["deviceStatus"] == "Yes") {
          this.device_array_of_devices.push(this.DeviceData[i]);
        }
      }
    });
    this.customerService.getCustomersAll().subscribe((data) => {
      this.customers = data;
      this.customerService.setCustomersData(data);
      for (let i = 0; i < this.customers.length; i++) {
        this.customer_array.push(
          this.customers[i]["firstName"] + " " + this.customers[i]["lastName"]
        );
      }
    });
    this.eventForm.get("customerName").valueChanges.subscribe((val) => {
      if (val) {
        this.eventForm.get("customerName").setValue("");
        this.customerService.getCustomerByCustomerId(val).subscribe((data) => {
          console.log(data);
          if (data.length > 0) {
            this.customerId = data[0].customerId;
          }
        });
      }
    });
    this.customerId = this.data?.customerId ? this.data.customerId : "";
  }

  submitEvent(): void {
    if (this.eventForm.valid) {
      //on edit
      if (this.data && this.data.id) {
        const event = this.eventForm.value as Event;
        event.id = this.data.id;
        event.deviceName = event.deviceId["name"];
        event.deviceValue = event.deviceId["alfa"];

        event.updatedBy = this.authUser.name
          ? this.authUser.name
          : "No Updates";
        event.updatedAt = new Date() ? new Date() : "No Updates";
        this.eventService.editEvent(event).subscribe(
          (data) => {
            this.dialogRef.close();
            let eventList = this.eventService.events;
            const eventIndex = eventList.findIndex(
              (elt) => elt.id == this.data.id
            );
            eventList[eventIndex] = event;
            this.eventService.setEventsData(eventList);
            this._snackBar.open("Event edited successfully", "X", {
              horizontalPosition: "center",
              verticalPosition: "top",
            });
          },
          (error) => {
            this._snackBar.open(error, "X", {
              horizontalPosition: "center",
              verticalPosition: "top",
            });
          }
        );
      } else {
        //on add
        const event = this.eventForm.value as Event;
        event.dateCreated = new Date();
        event.customerId = this.customerId;
        ///////////////Edited Here
        event.customerUniqueId = this.customerUniqueId;
        event.createdBy = this.authUser.name ? this.authUser.name : "";
        event.updatedBy = "No Updates";
        event.updatedAt = "No Updates";

        event.deviceName = event.deviceId["name"];
        event.deviceValue = event.deviceId["alfa"]; // alfasale

        event.eventId =
          "Cardio-" + Math.floor(new Date().getTime() + Math.random());

        this.eventService.addEvent(event).subscribe(
          (data) => {
            this.dialogRef.close();

            let eventList = this.eventService.events$.getValue();
            eventList.unshift(event);

            this.eventService.setEventsData(eventList);
            this._snackBar.open("Event added successfully", "X", {
              horizontalPosition: "center",
              verticalPosition: "top",
            });
          },
          (error) => {
            this._snackBar.open(error, "X", {
              horizontalPosition: "center",
              verticalPosition: "top",
            });
          }
        );
      }
    } else {
      this._snackBar.open("Some fields are invalid", "X", {
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    }
  }
}
