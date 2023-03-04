import {
  AngularFirestore,
  DocumentReference,
} from "@angular/fire/compat/firestore";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, map, Observable } from "rxjs";
import { Invoice } from "../models/invoice";
import { Customer } from "../models/customer";
import { Store } from "../models/store";
import { CustomerInvoices } from "../models/customerInvoices";
import { async } from "@firebase/util";

@Injectable({
  providedIn: "root",
})
export class InvoiceService {
  readonly filtered_invoices$ = new BehaviorSubject<Invoice[]>([]);
  readonly invoices$ = new BehaviorSubject<Invoice[]>([]);
  readonly customers$ = new BehaviorSubject<Customer[]>([]);
  readonly customerInvoices$ = new BehaviorSubject<CustomerInvoices[]>([]);
  readonly stores$ = new BehaviorSubject<Store[]>([]);
  constructor(private readonly afs: AngularFirestore) {}

  get invoices(): Invoice[] {
    return this.invoices$.getValue();
  }

  setInvoicesData(data: Invoice[]): void {
    this.invoices$.next(data);
  }
  setCustomerInvoices(data: CustomerInvoices[]): void {
    this.customerInvoices$.next(data);
  }

  addInvoice(invoice: Invoice): Observable<DocumentReference<unknown>> {
    return from(this.afs.collection("invoices").add(invoice));
  }

  editInvoice(invoice: Invoice): Observable<void> {
    return from(
      this.afs.collection("invoices").doc(invoice.id).update(invoice)
    );
  }
  getInvoices(): Observable<Invoice[]> {
    const collection = this.afs.collection<Invoice>("invoices", (ref) =>
      ref.orderBy("dateCreated", "desc")
    );
    const invoices$ = collection.valueChanges({ idField: "id" }).pipe(
      map((invoices) => {
        return invoices;
      })
    );
    return invoices$;
  }

  getInvoicesByFromTo(dateFrom: Date, dateTo: Date): Observable<Invoice[]> {
    const collection = this.afs.collection<Invoice>("invoices", (ref) =>
      ref
        .where("dateCreated", ">=", dateFrom)
        .where("dateCreated", "<=", dateTo)
    );
    const invoice$ = collection.valueChanges({ idField: "id" }).pipe(
      map((invoice) => {
        return invoice;
      })
    );
    return invoice$;
  }
  getInvoicesByCustomer(customerName): Observable<Invoice[]> {
    const collection = this.afs.collection<Invoice>("invoices", (ref) =>
      ref.where("customerId", "==", customerName).orderBy("dateCreated", "desc")
    );
    const customerInvoices$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customerInvoice) => {
        return customerInvoice;
      })
    );
    return customerInvoices$;
  }

  getCustomerInvoices(): Observable<CustomerInvoices[]> {
    const collection = this.afs.collection<CustomerInvoices>("invoices");
    const customerInvoices$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customerInvoices) => {
        return customerInvoices;
      })
    );
    return customerInvoices$;
  }

  deleteInvoice(id: string): Observable<void> {
    return from(this.afs.collection("invoices").doc(id).delete());
  }
}
