import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Device } from "src/app/models/device";
import { DevicesService } from "src/app/services/device.service";

@Component({
  selector: "app-device-form",
  templateUrl: "./add-device-form.component.html",
  styleUrls: ["./add-device-form.component.scss"],
})
export class AddDeviceFormComponent implements OnInit {
  deviceForm: FormGroup;
  editMode: boolean;
  name = new FormControl(this.data?.name ? this.data?.name : "", [
    Validators.required,
  ]);
  alfa = new FormControl(this.data?.alfa ? this.data?.alfa : "", [
    Validators.required,
  ]);
  deviceStatus = new FormControl(
    this.data?.deviceStatus ? this.data?.deviceStatus : "",
    [Validators.required]
  );
  deviceArray = ["Yes", "No"];
  url: string;
  constructor(
    private readonly fb: FormBuilder,
    private readonly deviceService: DevicesService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddDeviceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Device
  ) {}

  ngOnInit(): void {
    this.deviceService.getDevicesAll().subscribe((data) => {
      this.deviceService.setDevicesData(data);
    });

    this.deviceForm = this.fb.group({
      name: new FormControl(this.data?.name ? this.data?.name : "", [
        Validators.required,
        Validators.minLength(3),
      ]),
      alfa: new FormControl(this.data?.alfa ? this.data?.alfa : "", [
        Validators.required,
        Validators.minLength(3),
      ]),
      deviceStatus: this.deviceStatus,
    });
  }

  submitDeviceData(): void {
    if (this.deviceForm.valid) {
      //on edit
      if (this.data) {
        const device = this.deviceForm.value as Device;
        device.id = this.data.id;
        this.deviceService.editDevice(device).subscribe(
          (data) => {
            this.dialogRef.close();
            let deviceList = this.deviceService.devices;
            const customerIndex = deviceList.findIndex(
              (elt) => elt.id == this.data.id
            );
            deviceList[customerIndex] = device;
            this.deviceService.setDevicesData(deviceList);
            this._snackBar.open("Device Details edited successfully", "X", {
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
        const device = this.deviceForm.value as Device;
        const totalDevices = this.deviceService.devices.length;
        const totalString = totalDevices.toString();
        device.dateCreated = new Date();

        device.deviceId = "A-" + Math.floor(new Date().getTime() + Math.random());

        this.deviceService.addDevice(device).subscribe(
          (data) => {
            this.dialogRef.close();
            let customerList = this.deviceService.devices$.getValue();
            customerList.unshift(device);
            this.deviceService.setDevicesData(customerList);
            this._snackBar.open("Device Data added successfully", "X", {
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
