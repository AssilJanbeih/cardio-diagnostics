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
import { AddCampFormComponent } from "../add-camp-form/add-camp-form";
import { DisplayedColumns } from "src/app/shared/table/table.component";

import { Camp } from "src/app/models/camp";
import { CampsService } from "src/app/services/camp.service";

@Component({
  selector: "app-camps-list",
  templateUrl: "./camps-list.component.html",
  styleUrls: ["./camps-list.component.scss"],
})
export class CampsListComponent implements OnInit {
  campsArray: any[] = [];
  camps: Camp[] = [];
  authUser: AuthUser;
  columns: DisplayedColumns<Camp>[] = [
    {
      columnDef: "CampID",
      header: "Camp ID",
      cell: (element: Camp) => `${element.campId}`,
    },
    {
      columnDef: "name",
      header: "Name",
      cell: (element: Camp) => `${element.name}`,
    },
    {
      columnDef: "campStatus",
      header: "Active",
      cell: (element: Camp) => `${element.campStatus}`,
    },
    {
      columnDef: "actions",
      header: "Actions",
      cell: (element: Camp) => ``,
    },
  ];
  canEdit: boolean = true;
  canEnable: boolean = true;
  localCampService: CampsService;
  url: string;
  constructor(
    public afs: AngularFirestore,
    private readonly campService: CampsService,
    private readonly excelService: ExcelService,
    private readonly _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.campService.getCamps().subscribe((data) => {
      this.campService.setCampsData(data);
      this.camps = this.campService.camps$.getValue();
    });
  }

  exportCSV(): void {
    this.excelService.exportExcel(this.campService.camps, "Campaigns");
  }

  openAddCampaign() {
    this.dialog.open(AddCampFormComponent, {
      width: "800px",
      data: null,
    });
  }

  editCampaign(camp: Camp) {
    this.dialog.open(AddCampFormComponent, { width: "800px", data: camp });
  }
}
