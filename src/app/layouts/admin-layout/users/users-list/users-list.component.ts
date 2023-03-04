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
import { AddUserFormComponent } from "../add-user-form/add-user-form";
import { DisplayedColumns } from "src/app/shared/table/table.component";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.scss"],
})
export class UsersListComponent implements OnInit {
  userArray: any[] = [];
  authUser: AuthUser;

  columns: DisplayedColumns<User>[] = [
    {
      columnDef: "name",
      header: "Admin Name",
      cell: (element: User) => `${element.name}`,
    },
    {
      columnDef: "email",
      header: "Admin Email",
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
  localUserService: UsersService;
  url: string;
  constructor(
    public afs: AngularFirestore,
    private readonly router: Router,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly excelService: ExcelService,
    private readonly _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      // console.log(data);
      this.userService.setUsersData(data);
      this.url = this.router.url;
      this.authUser = this.authService.userValue;
      const users = this.userService.users$.getValue();
      console.log(users);
      this.userArray = users.filter((elt) => elt.adminId != this.authUser.uid);
    });

    this.localUserService = this.userService;
  }

  exportCSV(): void {
    this.excelService.exportExcel(this.userService.users, "users");
  }

  openAddUser() {
    this.dialog.open(AddUserFormComponent, {
      width: "800px",
      data: null,
    });
  }

  editUser(user: User) {
    this.dialog.open(AddUserFormComponent, { width: "800px", data: user });
  }

  enableDisableUser(user: User) {
    const enableDisableValue = JSON.parse(JSON.stringify(!user.is_enabled));
    this.userService.deleteUser(user.adminId, enableDisableValue).subscribe(
      () => {
        let userList = this.userService.users;
        const userIndex = userList.findIndex(
          (elt) => elt.adminId == user.adminId
        );
        userList[userIndex].is_enabled = enableDisableValue;
        this.userService.setUsersData(userList);
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
