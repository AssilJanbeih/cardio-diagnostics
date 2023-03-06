import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { User } from "src/app/models/users";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AuthUser } from "src/app/models/authUser.model";
import { AuthService } from "src/app/services/auth.service";
import { ExcelService } from "src/app/services/excel.service";
import { UsersService } from "src/app/services/users.service";
import { AddDeviceFormComponent } from "../add-device-form/add-device-form";
import { DisplayedColumns } from "src/app/shared/table/table.component";

import { Device } from "src/app/models/device";
import { DevicesService } from "src/app/services/device.service";

@Component({
  selector: "app-devices-list",
  templateUrl: "./devices-list.component.html",
  styleUrls: ["./devices-list.component.scss"],
})
export class DevicesListComponent implements OnInit {
  devicesArray: any[] = [];
  devices: Device[] = [];
  authUser: AuthUser;
  columns: DisplayedColumns<Device>[] = [
    {
      columnDef: "DeviceID",
      header: "Device ID",
      cell: (element: Device) => `${element.deviceId}`,
    },
    {
      columnDef: "name",
      header: "Name",
      cell: (element: Device) => `${element.name}`,
    },
    {
      columnDef: "deviceStatus",
      header: "Active",
      cell: (element: Device) => `${element.deviceStatus}`,
    },
    {
      columnDef: "actions",
      header: "Actions",
      cell: (element: Device) => ``,
    },
  ];
  canEdit: boolean = true;
  canEnable: boolean = true;
  localDeviceService: DevicesService;
  url: string;
  constructor(
    public afs: AngularFirestore,
    private readonly deviceService: DevicesService,
    private readonly excelService: ExcelService,
    private readonly _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.deviceService.getDevices().subscribe((data) => {
      this.deviceService.setDevicesData(data);
      this.devices = this.deviceService.devices$.getValue();
    });
  }

  exportCSV(): void {
    this.excelService.exportExcel(this.deviceService.devices, "Devices");
  }

  openAddDevice() {
    this.dialog.open(AddDeviceFormComponent, {
      width: "800px",
      data: null,
    });
  }

  editDevice(device: Device) {
    this.dialog.open(AddDeviceFormComponent, { width: "800px", data: device });
  }
}
