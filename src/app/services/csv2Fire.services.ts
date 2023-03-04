import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as Papa from "papaparse";
import * as _ from "lodash";
@Injectable({
  providedIn: "root",
})
export class Csv2fireService {
  csv_rec: any[] = [];
  header = false;
  constructor(private afs: AngularFirestore) {}
  process(file, collection) {
    Papa.parse(file, {
      complete: (res) => {
        this.csv_rec = res;
        this.firethis(this.csv_rec["data"], collection);
      },
      header: true,
    });
  }
  firethis(json, collection) {
    return new Promise<void>((resolve) => {
      _.map(json, (e, i) => {
        _.keys(e).map(() => {
          this.afs
            .collection(collection)
            .doc("doc " + i)
            .set(e);
        });
      });
      resolve();
    });
  }
}
