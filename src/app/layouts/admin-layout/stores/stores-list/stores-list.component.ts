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
import { AddStoreFormComponent } from "../add-store-form/add-store-form";
import { DisplayedColumns } from "src/app/shared/table/table.component";
import { Store } from "src/app/models/store";
import { StoresService } from "src/app/services/stores.service";

import { Csv2fireService } from "../../../../services/csv2Fire.services";
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from "@angular/fire/compat/storage";
import { Observable } from "rxjs";
@Component({
  selector: "app-stores-list",
  templateUrl: "./stores-list.component.html",
  styleUrls: ["./stores-list.component.scss"],
})
export class StoresListComponent implements OnInit {
  storeArray: any[] = [];
  stores: Store[] = [];
  authUser: AuthUser;

  columns: DisplayedColumns<Store>[] = [
    {
      columnDef: "StoreId",
      header: "Store ID",
      cell: (element: Store) =>
        `${element.storeId ? element.storeId : "Please fix the Imported file"}`,
    },
    {
      columnDef: "storeName",
      header: "Name",
      cell: (element: Store) =>
        `${
          element.storeName ? element.storeName : "Please fix the Imported file"
        }`,
    },
    {
      columnDef: "storeSatus",
      header: "Active",
      cell: (element: Store) =>
        `${
          element.storeStatus
            ? element.storeStatus
            : "Please fix the Imported file"
        }`,
    },
    {
      columnDef: "actions",
      header: "Actions",
      cell: (element: Store) => ``,
    },
  ];
  canEdit: boolean = true;
  canEnable: boolean = true;
  localStoreService: StoresService;
  url: string;
  message = "Uploading";
  showMessage: boolean = false;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;
  isHovering: boolean;
  isUploading: boolean;
  isUploaded: boolean;
  constructor(
    public afs: AngularFirestore,
    private readonly storeService: StoresService,
    private readonly excelService: ExcelService,
    private readonly authService: AuthService,
    private readonly _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private storage: AngularFireStorage,
    private csv2fire: Csv2fireService
  ) {
    this.isUploading = false;
    this.isUploaded = false;
  }
  ngOnInit(): void {
    this.storeService.getStores().subscribe((data) => {
      this.storeService.setStoresData(data);
      this.stores = this.storeService.stores$.getValue();
    });
    this.authUser = this.authService.user$.getValue();
  }

  exportCSV(): void {
    this.excelService.exportExcel(this.storeService.stores, "stores");
  }

  openAddStore() {
    this.dialog.open(AddStoreFormComponent, {
      width: "800px",
      data: null,
    });
  }

  editStore(store: Store) {
    this.dialog.open(AddStoreFormComponent, { width: "800px", data: store });
  }
  startUpload(event: FileList) {
    const file = event.item(0);
    if (file.type.split("/")[1] !== "csv") {
      console.error("Unsupported file type!!");
    }
    this.isUploading = true;
    this.isUploaded = false;
    this.csv2fire.process(file, "stores");
  }
  deleteAllStores() {
    this.excelService.exportExcel(this.storeService.stores, "stores");
    let query = this.afs.collection("stores").ref.get();
    query.then((doc) => {
      doc.forEach((docList) => {
        docList.ref.delete();
      });
    });
  }
}
