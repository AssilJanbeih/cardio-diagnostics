import { getAuth } from "firebase/auth";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  AngularFirestore,
  DocumentReference,
} from "@angular/fire/compat/firestore";
import { BehaviorSubject, from, map, Observable } from "rxjs";
import { User } from "../models/users";
import { Customer } from "../models/customer";
import { httpFactory } from "@angular/http/src/http_module";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  readonly users$ = new BehaviorSubject<User[]>([]);
  readonly customers$ = new BehaviorSubject<Customer[]>([]);
  constructor(
    public auth: AngularFireAuth,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  get users(): User[] {
    return this.users$.getValue();
  }
  get customers(): Customer[] {
    return this.customers$.getValue();
  }
  setUsersData(data): void {
    this.users$.next(data);
  }
  register(user: User, password: string) {
    return from(
      this.auth
        .createUserWithEmailAndPassword(user.email, password)
        .then((doc) => {
          user.adminId = doc.user.uid;
          return from(this.afs.collection("users").doc(doc.user.uid).set(user));
        })
        .catch((error) => {
          return error;
        })
    );
  }
  getUserByID(userId): Observable<User> {
    const collection = this.afs.collection<User>("users").doc(userId);
    const usersById$ = collection.valueChanges({ idField: "id" }).pipe(
      map((usersById) => {
        return usersById;
      })
    );
    return usersById$;
  }
  addUser(user: User): Observable<DocumentReference<unknown>> {
    return from(this.afs.collection("users").add(user));
  }

  editUser(user: User): Observable<void> {
    return from(this.afs.collection("users").doc(user.adminId).update(user));
  }

  deleteUser(id: string, is_enabled: boolean): Observable<void> {
    return from(
      this.afs.collection("users").doc(id).update({ is_enabled: is_enabled })
    );
  }

  getUsers(): Observable<User[]> {
    const collection = this.afs.collection<User>("users");
    const user$ = collection.valueChanges({ idField: "id" }).pipe(
      map((users) => {
        return users;
      })
    );

    return user$;
  }

  getCustomers(): Observable<Customer[]> {
    const collection = this.afs.collection<Customer>("customers");
    const customer$ = collection.valueChanges({ idField: "id" }).pipe(
      map((customers) => {
        return customers;
      })
    );

    return customer$;
  }
}
