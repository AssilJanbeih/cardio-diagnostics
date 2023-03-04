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
import { AddCsFormComponent } from "../add-cs-form/add-cs-form";
import { DisplayedColumns } from "src/app/shared/table/table.component";
import { CsService } from "src/app/services/cs.service";

@Component({
  selector: "app-users-list",
  templateUrl: "./cs-list.component.html",
  styleUrls: ["./cs-list.component.scss"],
})
export class CsListComponent implements OnInit {
  userArray: any[] = [];
  authUser: AuthUser;

  columns: DisplayedColumns<User>[] = [
    {
      columnDef: "name",
      header: "CS Name",
      cell: (element: User) => `${element.name}`,
    },
    {
      columnDef: "email",
      header: "CS Email",
      cell: (element: User) => `${element.email}`,
    },
    // {
    //   columnDef: "role",
    //   header: "Role",
    //   cell: (element: User) => `${element.role ? element.role : ""}`,
    // },
    {
      columnDef: "status",
      header: "Active",
      cell: (element: User) => `${element.is_enabled ? "Yes" : "No"}`,
    },
    {
      columnDef: "actions",
      header: "Actions",
      cell: (element: User) => ``,
    },
  ];
  canEdit: boolean = true;
  canDelete: boolean = false;
  canEnable: boolean = true;
  localUserService: CsService;
  url: string;
  constructor(
    public afs: AngularFirestore,
    private readonly router: Router,
    private readonly csService: CsService,
    private readonly authService: AuthService,
    private readonly excelService: ExcelService,
    private readonly _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.csService.getCsUsers().subscribe((data) => {
      // console.log(data);
      this.csService.setUsersData(data);
      this.url = this.router.url;
      this.authUser = this.authService.userValue;
      const users = this.csService.users$.getValue();
      console.log(users);
      this.userArray = users.filter((elt) => elt.adminId != this.authUser.uid);
    });

    this.localUserService = this.csService;
  }

  exportCSV(): void {
    this.excelService.exportExcel(this.csService.users, "cs");
  }

  openAddUser() {
    this.dialog.open(AddCsFormComponent, {
      width: "800px",
      data: null,
    });
  }

  editUser(user: User) {
    this.dialog.open(AddCsFormComponent, { width: "800px", data: user });
  }

  enableDisableUser(user: User) {
    const enableDisableValue = JSON.parse(JSON.stringify(!user.is_enabled));
    this.csService.deleteUser(user.adminId, enableDisableValue).subscribe(
      () => {
        let userList = this.csService.users;
        const userIndex = userList.findIndex(
          (elt) => elt.adminId == user.adminId
        );
        userList[userIndex].is_enabled = enableDisableValue;
        this.csService.setUsersData(userList);
      },
      (error) => {
        this._snackBar.open(error, "X", {
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      }
    );
  }
}
