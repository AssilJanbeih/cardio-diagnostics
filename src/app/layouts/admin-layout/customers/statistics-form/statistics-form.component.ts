import { FormGroup } from "@angular/forms";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Customer } from "src/app/models/customer";
import { Event } from "src/app/models/event";

@Component({
  selector: "app-statistics-form",
  templateUrl: "./statistics-form.component.html",
  styleUrls: ["./statistics-form.component.scss"],
})
export class StatisticsFormComponent implements OnInit {
  valueTotal: number = 0;
  overheadTotal: number = 0;
  tenantTotal: number = 0;

  constructor(
    public afs: AngularFirestore,
    public dialogRef: MatDialogRef<StatisticsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer
  ) {}

  ngOnInit(): void {
    console.log(this.data.id)
    let query_customers = this.afs.collection("events", (ref) =>
      ref.where("customerId", "==", this.data.id)
    );
    query_customers.get().subscribe((docList) => {
      docList.forEach((doc) => {
        let data = doc.data() as Event;
      });
    });
  }
}
