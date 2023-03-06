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
  campsArray: any[] = [];
  camps: Device[] = [];
  authUser: AuthUser;
  columns: DisplayedColumns<Device>[] = [
    {
      columnDef: "CampID",
      header: "Device ID",
      cell: (element: Device) => `${element.deviceId}`,
    },
    {
      columnDef: "name",
      header: "Name",
      cell: (element: Device) => `${element.name}`,
    },
    {
      columnDef: "campStatus",
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
  localCampService: DevicesService;
  url: string;
  constructor(
    public afs: AngularFirestore,
    private readonly campService: DevicesService,
    private readonly excelService: ExcelService,
    private readonly _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.campService.getDevices().subscribe((data) => {
      this.campService.setDevicesData(data);
      this.camps = this.campService.devices$.getValue();
    });
  }

  exportCSV(): void {
    this.excelService.exportExcel(this.campService.devices, "Devices");
  }

  openAddCampaign() {
    this.dialog.open(AddDeviceFormComponent, {
      width: "800px",
      data: null,
    });
  }

  editCampaign(camp: Device) {
    this.dialog.open(AddDeviceFormComponent, { width: "800px", data: camp });
  }
}
