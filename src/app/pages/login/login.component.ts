import { MatSnackBar } from "@angular/material/snack-bar";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private afAuth: AngularFireAuth,
    private readonly _snackBar: MatSnackBar,
    private readonly router: Router
  ) {}
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }
  login(user) {
    // console.log(this.loginForm);
    if (this.loginForm.valid) {
      this.authService.login(user);
    } else {
      this._snackBar.open("Some fields are invalid", "X", {
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    }
  }

  resetPassword() {
    if (this.loginForm.value.email) {
      this.afAuth.sendPasswordResetEmail(this.loginForm.value.email).then(
        () => {
          this._snackBar.open(
            "PLease check your email in order to reset your pasword",
            "X",
            {
              horizontalPosition: "center",
              verticalPosition: "top",
            }
          );
        },
        (error) => {
          this._snackBar.open("Error occured", "X", {
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        }
      );
    } else {
      this._snackBar.open(
        "Please enter your email in order to reset your password",
        "X",
        {
          horizontalPosition: "center",
          verticalPosition: "top",
        }
      );
    }
  }
  ngOnDestroy() {}
}
