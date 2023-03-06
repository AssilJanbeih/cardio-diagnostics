import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ExcelService } from "../../../../services/excel.service";
import { DisplayedColumns } from "../../../../shared/table/table.component";
import { Component, OnInit } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { CustomerFormComponent } from "../customer-form/customer-form.component";
import * as firebase from "firebase/firestore";
import { Customer } from "src/app/models/customer";
import { CustomerService } from "src/app/services/customer.service";
import { StatisticsFormComponent } from "../statistics-form/statistics-form.component";
import { AuthUser } from "src/app/models/authUser.model";
import { AuthService } from "src/app/services/auth.service";
import { EventService } from "src/app/services/event.service";

import { Event } from "src/app/models/event";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Component({
  selector: "app-customers-list",
  templateUrl: "./customers-list.component.html",
  styleUrls: ["./customers-list.component.scss"],
})
export class CustomersListComponent implements OnInit {
  columns: DisplayedColumns<Customer>[] = [
    {
      columnDef: "CustomerId",
      header: "Patient Id",
      cell: (element: Customer) => `${element.customerId}`,
    },
    {
      columnDef: "firstName",
      header: "Name",
      cell: (element: Customer) =>
        `${element.firstName} \n ${element.lastName}`,
    },
    {
      columnDef: "email",
      header: "Email",
      cell: (element: Customer) => `${element.email}`,
    },
    {
      columnDef: "dob",
      header: "Date of Birth",
      cell: (element: Customer) => `${element.dob}`,
    },
    {
      columnDef: "dateCreated",
      header: "Create On",
      cell: (element: Customer) =>
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
      cell: (element: Customer) => ``,
    },
  ];
  customers: Customer[] = [];
  canEdit: boolean = true;
  canDelete: boolean = true;
  add_new_customer: string;
  haveStatistic: boolean = true;
  localCustomerService: CustomerService;
  user: AuthUser;
  url: string;
  startDate: Date;
  endDate: Date;
  totalCustomer: number;
  type: string;
  constructor(
    private readonly excelService: ExcelService,
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    private readonly router: Router,
    private readonly afs: AngularFirestore,
    private readonly activatedRoute: ActivatedRoute,
    private readonly _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data) => {
      console.log(data);
      this.type =
        data.type == "privilege"
          ? "Privilege"
          : data.type == "regular"
          ? "Regular"
          : "Default";
      if (this.type == "Default") {
        this.customerService.getCustomersAll().subscribe((data) => {
          // console.log(data);
          this.customerService.setCustomersData(data);
          this.customers = this.customerService.customers$.getValue();
          this.add_new_customer = "New Patient";
        });
      } else {
        this.customerService.getCustomers(this.type).subscribe((data) => {
          // console.log(data);
          this.customerService.setCustomersData(data);
          this.customers = this.customerService.customers$.getValue();
          this.add_new_customer = "New Patient";
        });
      }
    });
    this.url = this.router.url;
    this.user = this.authService.user$.getValue();
    this.canEdit = true;
    this.canDelete = false;

    this.localCustomerService = this.customerService;
  }

  exportCSV(): void {
    this.excelService.exportExcel(this.customerService.customers, "patients");
  }
  deleteAllCustoemrs() {
    this.excelService.exportExcel(this.customerService.customers, "patients");
    let query = this.afs.collection("customers").ref.get();
    query.then((doc) => {
      doc.forEach((docList) => {
        docList.ref.delete();
      });
    });
  }
  exportCSV2() {
    this.customers = this.customers.map((elt) => {
      return {
        ...elt,
        full_name: elt.firstName + " " + elt.lastName,
      };
    });
    this.excelService.exportExcel(this.customers, "Users");
  }
  openAddCustomer() {
    this.dialog.open(CustomerFormComponent, { width: "800px", data: null });
  }

  editCustomer(customer: Customer) {
    this.dialog.open(CustomerFormComponent, { width: "800px", data: customer });
  }

  deleteCustomer(customer: Customer) {
    this.customerService.deleteCustomer(customer.id).subscribe(
      () => {
        let customerList = this.customerService.customers;
        const customerIndex = customerList.findIndex(
          (elt) => elt.id == customer.id
        );
        customerList = customerList.splice(customerIndex, 1);
        this.customerService.setCustomersData(customerList);
      },
      (error) => {
        this._snackBar.open(error, "X", {
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      }
    );
  }

  viewProfile(customer: Customer) {
    this.router.navigate(["/PatientManagement/" + customer.id]);
  }

  search() {
    if (this.startDate && this.endDate) {
      this.customers = [];
      let start = new Date(this.startDate);
      let end = new Date(this.endDate);
      this.customerService
        .getCustomersByFromTo(start, end)
        .subscribe((data) => {
          this.customerService.setCustomersData(data);
          this.customers = this.customerService.customers$.getValue();
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
    this.customerService.getCustomers(this.type).subscribe((data) => {
      this.customerService.setCustomersData(data);
      this.customers = this.customerService.customers$.getValue();
    });
  }
}
