import { Component, OnInit, ElementRef } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { AuthUser } from "src/app/models/authUser.model";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  user: AuthUser;

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.user$.getValue();
  }

  logout() {
    this.authService.logout();
  }
}
