import { Router } from "@angular/router";
import { CustomerService } from "../../../../services/customer.service";
import countryCodes from "country-codes-list";
import { Country } from "src/app/models/countries";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Component, Inject, OnInit } from "@angular/core";
import { CountriesService } from "src/app/services/countries.service";
import { Customer } from "src/app/models/customer";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Payload } from "../../sales_force_responses/sales_force_response";
import { Store } from "src/app/models/store";
import { StoresService } from "src/app/services/stores.service";
import { dateInputsHaveChanged } from "@angular/material/datepicker/datepicker-input-base";

@Component({
  selector: "app-store-form",
  templateUrl: "./add-store-form.component.html",
  styleUrls: ["./add-store-form.component.scss"],
})
export class AddStoreFormComponent implements OnInit {
  storeForm: FormGroup;
  editMode: boolean;
  countries: Country[];
  storeName = new FormControl(
    this.data?.storeName ? this.data?.storeName : "",
    [Validators.required]
  );
  // memberType = new FormControl(
  //   this.data?.memberType ? this.data?.memberType : "",
  //   [Validators.required]
  // );
  storeStatus = new FormControl(
    this.data?.storeStatus ? this.data?.storeStatus : "",
    [Validators.required]
  );

  statusArray = ["Yes", "No"];

  url: string;
  countryCodesObject: any;
  countryCodesArray: { country: string; value: string }[] = [];
  constructor(
    private readonly httpClient: HttpClient,
    private readonly fb: FormBuilder,
    private readonly countryService: CountriesService,
    private readonly storeService: StoresService,
    private readonly router: Router,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddStoreFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Store
  ) {}

  ngOnInit(): void {
    this.storeService.getStoresAll().subscribe((data) => {
      this.storeService.setStoresData(data);
    });
    this.url = this.router.url;
    this.countries = this.countryService.countries;

    this.storeForm = this.fb.group({
      storeName: new FormControl(
        this.data?.storeName ? this.data?.storeName : "",
        [Validators.required, Validators.minLength(3)]
      ),

      storeStatus: this.storeStatus,
    });
  }

  submitStoreData(): void {
    if (this.storeForm.valid) {
      //on edit
      if (this.data) {
        const store = this.storeForm.value as Store;
        store.id = this.data.id;
        var date = Date.now();
        store.dateCreated = Date.parse(date.toString());
        // customer.generatedDigit = generateMemberShipGiftNumber(
        //   customer.qatarAirwaysNumber
        // );

        this.storeService.editStore(store).subscribe(
          (data) => {
            this.dialogRef.close();
            let customerList = this.storeService.stores;
            // console.log(customerList, "list");
            const customerIndex = customerList.findIndex(
              (elt) => elt.id == this.data.id
            );
            customerList[customerIndex] = store;
            // console.log(customerList[customerIndex], "customers edited");
            this.storeService.setStoresData(customerList);
            this._snackBar.open("Store Details edited successfully", "X", {
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
        const customerList = this.storeService.stores;
        const store = this.storeForm.value as Store;

        const totalCustomer = this.storeService.stores.length;
        const totalString = totalCustomer.toString();
        store.dateCreated = new Date();
        store.storeId =
          "shop&win-Store" + Math.floor(new Date().getTime() + Math.random());

        // customer.memberType =
        //   this.url.indexOf("privilege") > -1 ? "Privilege" : "Regular";

        // customer.generatedDigit = generateMemberShipGiftNumber(
        //   customer.qatarAirwaysNumber
        // );

        this.storeService.addStore(store).subscribe(
          (data) => {
            // debugger;
            this.dialogRef.close();
            // console.log(data);
            let customerList = this.storeService.stores$.getValue();
            customerList.unshift(store);
            // console.log("invoice add", customer);
            this.storeService.setStoresData(customerList);

            this._snackBar.open("Store Data added successfully", "X", {
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
