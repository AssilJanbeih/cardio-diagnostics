import { MatSnackBar } from "@angular/material/snack-bar";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit } from "@angular/core";
import { AuthUser } from "src/app/models/authUser.model";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  user: AuthUser;
  changePassForm: FormGroup;
  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly _snackBar: MatSnackBar,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.changePassForm = this.fb.group(
      {
        password: ["", [Validators.minLength(6), Validators.required]],
        confirmPass: ["", [Validators.minLength(6), Validators.required]],
      },
      { validators: this.authService.passwordConfirmation }
    );
    this.user = this.authService.user$.getValue();
  }

  async changePass(value) {
    // console.log(this.changePassForm);
    if (this.changePassForm.valid) {
      const auth = await this.afAuth.currentUser;
      // const user = auth().currentUser;

      auth
        .updatePassword(value.password)
        .then(() => {
          this._snackBar.open("Password updated successfuly", "X", {
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        })
        .catch((error) => {
          this._snackBar.open(error.message, "X", {
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        });
    } else {
      this._snackBar.open("Both fields are required and must match", "X", {
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    }
  }
}
