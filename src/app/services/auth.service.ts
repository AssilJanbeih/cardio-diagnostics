import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from "../models/users";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import firebase from "firebase-tools";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";
import { AuthUser } from "../models/authUser.model";
import { AbstractControl } from "@angular/forms";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly user$ = new BehaviorSubject<AuthUser | null>(null);
  constructor(
    public auth: AngularFireAuth,
    private readonly _snackBar: MatSnackBar,
    private afs: AngularFirestore,
    private readonly router: Router
  ) {
    this.restoreUserData();
  }
  // get user$(): Observable<AuthUser | null> {
  //   return this.#user$.asObservable();
  // }
  get userValue(): AuthUser {
    return this.user$.getValue();
  }

  login(value) {
    this.auth
      .signInWithEmailAndPassword(value.email, value.password)
      .then((doc) => {
        this.afs
          .collection("users")
          .doc(doc.user.uid)
          .get()
          .subscribe((data) => {
            // console.log(data);
            if (data.exists) {
              const user = data.data() as AuthUser;
              if (user.is_enabled) {
                user.uid = doc.user.uid;
                this.setUserData(user);
                this.router.navigate(["/"]);
              } else {
                this._snackBar.open("User is not active", "X", {
                  horizontalPosition: "center",
                  verticalPosition: "top",
                });
              }
            } else {
              this._snackBar.open("User does not exist", "X", {
                horizontalPosition: "center",
                verticalPosition: "top",
              });
            }
          });
      })
      .catch((error) => {
        this._snackBar.open("wrong credentials", "X", {
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      });
  }
  logout() {
    this.resetUserData();
    this.auth.signOut();
    this.router.navigate(["/login"]);
  }
  // resetPassword(email: string) {
  //   this.auth.sendPasswordResetEmail(email)
  // }
  setUserData(data: AuthUser): void {
    const user = data;
    this.user$.next(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }
  restoreUserData(): void {
    const data = JSON.parse(localStorage.getItem("user"));
    // console.log(data, "data");
    this.user$.next(data);
  }
  resetUserData(): void {
    localStorage.clear();
    this.user$.next(null);
  }
  passwordConfirmation(control: AbstractControl): { invalid: boolean } {
    if (control.get("password").value !== control.get("confirmPass").value) {
      return { invalid: true };
    } else {
      return null;
    }
  }
}
