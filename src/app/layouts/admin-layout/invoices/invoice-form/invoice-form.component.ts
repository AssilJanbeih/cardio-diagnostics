import { MatSnackBar } from "@angular/material/snack-bar";
import { UsersService } from "src/app/services/users.service";
import { InvoiceService } from "./../../../../services/invoice.service";
import { Country } from "src/app/models/countries";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Component, Inject, OnInit } from "@angular/core";
import { CountriesService } from "src/app/services/countries.service";
import { Invoice } from "src/app/models/invoice";
import { User } from "src/app/models/users";
import * as firebase from "firebase/firestore";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AggregatorService } from "src/app/services/aggregator.service";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Store } from "src/app/models/store";
import { Customer } from "src/app/models/customer";
import { BehaviorSubject, from, map, Observable } from "rxjs";
import { StoresService } from "src/app/services/stores.service";
import { CustomerService } from "src/app/services/customer.service";
import { ThrowStmt } from "@angular/compiler";
import { AuthService } from "src/app/services/auth.service";
import { AuthUser } from "src/app/models/authUser.model";
import { Router } from "@angular/router";
import { CampsService } from "src/app/services/camp.service";
import { Camp } from "src/app/models/camp";

@Component({
  selector: "app-invoice-form",
  templateUrl: "./invoice-form.component.html",
  styleUrls: ["./invoice-form.component.scss"],
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  url: string;
  editMode: boolean;
  user: AuthUser;
  customers: Customer[];
  campaigns: Camp[];
  storeData: Store[];
  CampData: Camp[];
  invoicesData: Invoice[];
  localUserService: UsersService;
  store_array_of_name = [];
  camp_array_of_camps = [];

  camp_alfa_value = 0;
  invoices_array_of_id_by_customr: [];
  customer_array = [];
  customers_ids = [];
  overhead: number;
  salesValue: number;
  authUser: AuthUser;
  storeName = new FormControl(this.data?.storeName ? this.data?.storeName : "");
  campId = new FormControl(this.data?.campId ? this.data?.campId : "");
  serialNumber = new FormControl(
    this.data?.serialNumber ? this.data?.serialNumber : ""
  );
  amount = new FormControl(this.data?.amount ? this.data?.amount : "");
  label = new FormControl(this.data?.label ? this.data?.label : "");
  customerId: string;
  customerUniqueId: string;
  constructor(
    private readonly fb: FormBuilder,
    private readonly invoiceService: InvoiceService,
    private readonly campService: CampsService,
    private readonly storeService: StoresService,
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
    private readonly _snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly userService: UsersService,
    public dialogRef: MatDialogRef<InvoiceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Invoice
  ) {}

  ngOnInit(): void {
    this.campService.getCampsAll().subscribe((data2) => {
      this.campaigns = data2;
      this.campService.setCampsData(data2);
    });
    this.invoiceService.getInvoices().subscribe((data) => {
      this.invoiceService.setInvoicesData(data);
    });
    this.customerService.getCustomersAll().subscribe((data) => {
      this.customers = data;
      this.customerService.setCustomersData(data);
    });
    this.customerId = this.data?.customerId ? this.data.customerId : "";
    this.customerUniqueId = this.data?.customerUniqueId
      ? this.data.customerUniqueId
      : "";
    this.invoiceForm = this.fb.group({
      storeName: this.storeName,

      campId: this.campId,
      amount: this.amount,
      serialNumber: new FormControl(
        this.data?.serialNumber ? this.data?.serialNumber : ""
      ),
      customerName: new FormControl(
        this.data?.customerName ? this.data?.customerName : ""
      ),
    });
    this.overhead = 0;
    this.store_array_of_name = [];
    this.customer_array = [];
    this.customers_ids = [];
    this.authUser = this.authService.userValue;
    this.localUserService = this.userService;
    this.userService.getUsers().subscribe((data) => {
      this.userService.setUsersData(data);
      this.authUser = this.authService.userValue;
    });
    this.storeService.getStores().subscribe((data) => {
      this.storeData = data;
      this.storeService.setStoresData(data);
      for (let i = 0; i < this.storeData.length; i++) {
        if (this.storeData[i]["storeStatus"] == "Yes") {
          this.store_array_of_name.push(this.storeData[i]["storeName"]);
        }
      }
    });
    this.campService.getCamps().subscribe((data) => {
      this.CampData = data;
      this.campService.setCampsData(data);

      for (let i = 0; i < this.CampData.length; i++) {
        if (this.CampData[i]["campStatus"] == "Yes") {
          this.camp_array_of_camps.push(this.CampData[i]);
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
    this.invoiceForm.get("customerName").valueChanges.subscribe((val) => {
      if (val) {
        this.invoiceForm.get("customerName").setValue("");
        this.customerService.getCustomerByQatarId(val).subscribe((data) => {
          console.log(data);
          if (data.length > 0) {
            this.customerId = data[0].customerId;
          }
        });
      }
    });
    this.customerId = this.data?.customerId ? this.data.customerId : "";
  }

  submitInvoice(): void {
    if (this.invoiceForm.valid) {
      //on edit
      if (this.data && this.data.id) {
        const invoice = this.invoiceForm.value as Invoice;
        invoice.id = this.data.id;
        invoice.campName = invoice.campId["name"];
        invoice.campValue = invoice.campId["alfa"];
        
         // alfasale
        if (invoice.amount < invoice.campValue) {
          invoice.overhead = invoice.amount;
        } else {
          invoice.overhead = Math.floor(invoice.amount % invoice.campValue);
        }
        invoice.updatedBy = this.authUser.name
          ? this.authUser.name
          : "No Updates";
        invoice.updatedAt = new Date() ? new Date() : "No Updates";
        this.invoiceService.editInvoice(invoice).subscribe(
          (data) => {
            this.dialogRef.close();
            let invoiceList = this.invoiceService.invoices;
            const invoiceIndex = invoiceList.findIndex(
              (elt) => elt.id == this.data.id
            );
            invoiceList[invoiceIndex] = invoice;
            this.invoiceService.setInvoicesData(invoiceList);
            this._snackBar.open("Invoice edited successfully", "X", {
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
        const invoicesList = this.invoiceService.invoices;
        const invoice = this.invoiceForm.value as Invoice;
        const serialNumberExist = invoicesList.filter(
          (elt) => elt.serialNumber == invoice.serialNumber
        );
        if (serialNumberExist.length > 0) {
          this._snackBar.open("Serial Number already exist", "X", {
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        } else {
          invoice.dateCreated = new Date();
          invoice.customerId = this.customerId;
          ///////////////Edited Here
          invoice.customerUniqueId = this.customerUniqueId;
          invoice.createdBy = this.authUser.name ? this.authUser.name : "";
          invoice.updatedBy = "No Updates";
          invoice.updatedAt = "No Updates";

          invoice.campName = invoice.campId["name"];
          invoice.campValue = invoice.campId["alfa"]; // alfasale

          if (invoice.amount < invoice.campValue) {
            invoice.overhead = invoice.amount;
          } else {

            invoice.overhead = Math.floor(invoice.amount % invoice.campValue);
          }
          // console.log(invoice.overhead);

          invoice.invoiceId =
            "shop&win-" + Math.floor(new Date().getTime() + Math.random());

          this.invoiceService.addInvoice(invoice).subscribe(
            (data) => {
              this.dialogRef.close();

              let invoiceList = this.invoiceService.invoices$.getValue();
              invoiceList.unshift(invoice);

              this.invoiceService.setInvoicesData(invoiceList);
              this._snackBar.open("Invoice added successfully", "X", {
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
      }
    } else {
      this._snackBar.open("Some fields are invalid", "X", {
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    }
  }
}
