import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  DocumentReference,
} from "@angular/fire/compat/firestore";
import { Observable, map, BehaviorSubject, from } from "rxjs";
import { Device } from "../models/device";

@Injectable({
  providedIn: "root",
})
export class DevicesService {
  readonly devices$ = new BehaviorSubject<Device[]>([]);
  constructor(private readonly afs: AngularFirestore) {}

  get devices(): Device[] {
    return this.devices$.getValue();
  }

  setDevicesData(data: Device[]): void {
    this.devices$.next(data);
  }
  getDevicesAll(): Observable<Device[]> {
    const collection = this.afs.collection<Device>("devices");
    const devices$ = collection.valueChanges({ idField: "id" }).pipe(
      map((devices) => {
        return devices;
      })
    );
    return devices$;
  }
  getDevices(): Observable<Device[]> {
    const collection = this.afs.collection<Device>("devices");
    const devices$ = collection.valueChanges({ idField: "id" }).pipe(
      map((stores) => {
        return stores;
      })
    );

    return devices$;
  }

  addDevice(device: Device): Observable<DocumentReference<unknown>> {
    return from(this.afs.collection("devices").add(device));
  }

  editDevice(device: Device): Observable<void> {
    return from(this.afs.collection("devices").doc(device.id).update(device));
  }
  deleteDevice(id: string): Observable<void> {
    return from(this.afs.collection("devices").doc(id).delete());
  }
}
