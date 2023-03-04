import { Country } from "src/app/models/countries";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Camp } from "src/app/models/camp";
import { CampsService } from "src/app/services/camp.service";

@Component({
  selector: "app-device-form",
  templateUrl: "./add-device-form.component.html",
  styleUrls: ["./add-device-form.component.scss"],
})
export class AddDeviceFormComponent implements OnInit {
  campForm: FormGroup;
  editMode: boolean;
  countries: Country[];
  name = new FormControl(this.data?.name ? this.data?.name : "", [
    Validators.required,
  ]);
  alfa = new FormControl(this.data?.alfa ? this.data?.alfa : "", [
    Validators.required,
  ]);
  campStatus = new FormControl(
    this.data?.campStatus ? this.data?.campStatus : "",
    [Validators.required]
  );
  campArray = ["Yes", "No"];
  url: string;
  countryCodesObject: any;
  countryCodesArray: { country: string; value: string }[] = [];
  constructor(
    private readonly fb: FormBuilder,
    private readonly campService: CampsService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddDeviceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Camp
  ) {}

  ngOnInit(): void {
    this.campService.getCampsAll().subscribe((data) => {
      this.campService.setCampsData(data);
    });

    this.campForm = this.fb.group({
      name: new FormControl(this.data?.name ? this.data?.name : "", [
        Validators.required,
        Validators.minLength(3),
      ]),
      alfa: new FormControl(this.data?.alfa ? this.data?.alfa : "", [
        Validators.required,
        Validators.minLength(3),
      ]),
      campStatus: this.campStatus,
    });
  }

  submitCampData(): void {
    if (this.campForm.valid) {
      //on edit
      if (this.data) {
        const camp = this.campForm.value as Camp;
        camp.id = this.data.id;
        this.campService.editCamp(camp).subscribe(
          (data) => {
            this.dialogRef.close();
            let campList = this.campService.camps;
            const customerIndex = campList.findIndex(
              (elt) => elt.id == this.data.id
            );
            campList[customerIndex] = camp;
            this.campService.setCampsData(campList);
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
        const camp = this.campForm.value as Camp;
        const totlaCamps = this.campService.camps.length;
        const totalString = totlaCamps.toString();
        camp.dateCreated = new Date();

        camp.campId = "A-" + Math.floor(new Date().getTime() + Math.random());

        this.campService.addCamp(camp).subscribe(
          (data) => {
            this.dialogRef.close();
            let customerList = this.campService.camps$.getValue();
            customerList.unshift(camp);
            this.campService.setCampsData(customerList);
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
