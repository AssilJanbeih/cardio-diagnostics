import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  DocumentReference,
} from "@angular/fire/compat/firestore";
import { Observable, map, BehaviorSubject, from } from "rxjs";
import { Camp } from "../models/camp";

@Injectable({
  providedIn: "root",
})
export class CampsService {
  readonly camps$ = new BehaviorSubject<Camp[]>([]);
  constructor(private readonly afs: AngularFirestore) {}

  get camps(): Camp[] {
    return this.camps$.getValue();
  }

  setCampsData(data: Camp[]): void {
    this.camps$.next(data);
  }
  getCampsAll(): Observable<Camp[]> {
    const collection = this.afs.collection<Camp>("devices");
    const camps$ = collection.valueChanges({ idField: "id" }).pipe(
      map((camps) => {
        return camps;
      })
    );
    return camps$;
  }
  getCamps(): Observable<Camp[]> {
    const collection = this.afs.collection<Camp>("devices");
    const camp$ = collection.valueChanges({ idField: "id" }).pipe(
      map((stores) => {
        return stores;
      })
    );

    return camp$;
  }

  addCamp(camp: Camp): Observable<DocumentReference<unknown>> {
    return from(this.afs.collection("devices").add(camp));
  }

  editCamp(camp: Camp): Observable<void> {
    return from(this.afs.collection("devices").doc(camp.id).update(camp));
  }
  deleteCamp(id: string): Observable<void> {
    return from(this.afs.collection("devices").doc(id).delete());
  }
}
