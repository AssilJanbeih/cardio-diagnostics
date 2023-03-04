import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  DocumentReference,
} from "@angular/fire/compat/firestore";
import { Observable, map, BehaviorSubject, from } from "rxjs";
import { Store } from "../models/store";

@Injectable({
  providedIn: "root",
})
export class StoresService {
  readonly stores$ = new BehaviorSubject<Store[]>([]);
  constructor(private readonly afs: AngularFirestore) {}

  get stores(): Store[] {
    return this.stores$.getValue();
  }

  setStoresData(data: Store[]): void {
    this.stores$.next(data);
  }
  getStoresAll(): Observable<Store[]> {
    const collection = this.afs.collection<Store>("stores");
    const stores$ = collection.valueChanges({ idField: "id" }).pipe(
      map((stores) => {
        return stores;
      })
    );
    return stores$;
  }
  getStores(): Observable<Store[]> {
    const collection = this.afs.collection<Store>("stores");
    const store$ = collection.valueChanges({ idField: "id" }).pipe(
      map((stores) => {
        return stores;
      })
    );

    return store$;
  }

  addStore(store: Store): Observable<DocumentReference<unknown>> {
    return from(this.afs.collection("stores").add(store));
  }

  editStore(store: Store): Observable<void> {
    return from(this.afs.collection("stores").doc(store.id).update(store));
  }
  deleteStore(id: string): Observable<void> {
    return from(this.afs.collection("stores").doc(id).delete());
  }
}
