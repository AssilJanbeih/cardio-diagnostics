import {
  AngularFirestore,
  DocumentReference,
} from "@angular/fire/compat/firestore";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, map, Observable } from "rxjs";
import { Customer } from "../models/customer";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  readonly customers$ = new BehaviorSubject<Customer[]>([]);
  constructor(private readonly afs: AngularFirestore) {}

  get customers(): Customer[] {
    return this.customers$.getValue();
  }

  setCustomersData(data: Customer[]): void {
    this.customers$.next(data);
  }

  addCustomer(customer: Customer): Observable<DocumentReference<unknown>> {
    return from(this.afs.collection("customers").add(customer));
  }

  editCustomer(customer: Customer): Observable<void> {
    return from(
      this.afs.collection("customers").doc(customer.id).update(customer)
    );
  }

  getCustomerById(customerId): Observable<Customer> {
    const collection = this.afs
      .collection<Customer>("customers")
      .doc(customerId);
    const customerInvoices$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customerInvoice) => {
        return customerInvoice;
      })
    );
    return customerInvoices$;
  }

  getCustomers(type: string): Observable<Customer[]> {
    const collection = this.afs.collection<Customer>("customers", (ref) =>
      ref.where("memberType", "==", type)
    );
    const customers$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customers) => {
        return customers;
      })
    );
    return customers$;
  }
  getCustomersdefault(): Observable<Customer[]> {
    const collection = this.afs.collection<Customer>("customers");
    const customers$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customers) => {
        return customers;
      })
    );
    return customers$;
  }
  getCustomersAll(): Observable<Customer[]> {
    const collection = this.afs.collection<Customer>("customers");
    const customers$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customers) => {
        return customers;
      })
    );
    return customers$;
  }
  getCustomersByFromTo(dateFrom: Date, dateTo: Date): Observable<Customer[]> {
    const collection = this.afs.collection<Customer>("customers", (ref) =>
      ref
        .where("dateCreated", ">=", dateFrom)
        .where("dateCreated", "<=", dateTo)
    );
    const customers$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customers) => {
        return customers;
      })
    );
    return customers$;
  }

  getQatarIdByCustomer(customerId: string): Observable<Customer> {
    const collection = this.afs
      .collection<Customer>("customers")
      .doc(customerId);
    const customer$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customer) => {
        return customer;
      })
    );
    return customer$;
  }

  getCustomerByQatarId(customerId: string): Observable<Customer[]> {
    const collection = this.afs.collection<Customer>("customers", (ref) =>
      ref.where("id", "==", customerId)
    );
    const customers$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customers) => {
        return customers;
      })
    );
    return customers$;
  }

  deleteCustomer(id: string): Observable<void> {
    return from(this.afs.collection("customers").doc(id).delete());
  }
}
