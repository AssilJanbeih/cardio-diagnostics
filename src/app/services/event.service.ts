import {
  AngularFirestore,
  DocumentReference,
} from "@angular/fire/compat/firestore";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, map, Observable } from "rxjs";
import { Event } from "../models/event";
import { Customer } from "../models/customer";
import { CustomerEvents as CustomerEvents } from "../models/customerevents";
import { async } from "@firebase/util";

@Injectable({
  providedIn: "root",
})
export class EventService {
  readonly filtered_events$ = new BehaviorSubject<Event[]>([]);
  readonly events$ = new BehaviorSubject<Event[]>([]);
  readonly customers$ = new BehaviorSubject<Customer[]>([]);
  readonly customerEvents$ = new BehaviorSubject<CustomerEvents[]>([]);
  constructor(private readonly afs: AngularFirestore) {}

  get events(): Event[] {
    return this.events$.getValue();
  }

  setEventsData(data: Event[]): void {
    this.events$.next(data);
  }
  setCustomerEvents(data: CustomerEvents[]): void {
    this.customerEvents$.next(data);
  }

  addEvent(event: Event): Observable<DocumentReference<unknown>> {
    return from(this.afs.collection("events").add(event));
  }

  editEvent(event: Event): Observable<void> {
    return from(this.afs.collection("events").doc(event.id).update(event));
  }
  getEvents(): Observable<Event[]> {
    const collection = this.afs.collection<Event>("events", (ref) =>
      ref.orderBy("dateCreated", "desc")
    );
    const events$ = collection.valueChanges({ idField: "id" }).pipe(
      map((events) => {
        return events;
      })
    );
    return events$;
  }

  getEventsByFromTo(dateFrom: Date, dateTo: Date): Observable<Event[]> {
    const collection = this.afs.collection<Event>("events", (ref) =>
      ref
        .where("dateCreated", ">=", dateFrom)
        .where("dateCreated", "<=", dateTo)
    );
    const event$ = collection.valueChanges({ idField: "id" }).pipe(
      map((event) => {
        return event;
      })
    );
    return event$;
  }
  getEventsByCustomer(customerName): Observable<Event[]> {
    const collection = this.afs.collection<Event>("events", (ref) =>
      ref.where("customerId", "==", customerName).orderBy("dateCreated", "desc")
    );
    const customerEvents$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customerEvent) => {
        return customerEvent;
      })
    );
    return customerEvents$;
  }

  getCustomerEvents(): Observable<CustomerEvents[]> {
    const collection = this.afs.collection<CustomerEvents>("events");
    const customerEvents$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customerEvents) => {
        return customerEvents;
      })
    );
    return customerEvents$;
  }

  deleteEvent(id: string): Observable<void> {
    return from(this.afs.collection("events").doc(id).delete());
  }
}
