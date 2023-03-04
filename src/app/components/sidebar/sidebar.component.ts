import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CustomerFormComponent } from "src/app/layouts/admin-layout/customers/customer-form/customer-form.component";
import { AuthService } from "src/app/services/auth.service";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  initialRoute: RouteInfo[] = [
    {
      path: "/",
      title: "Dashboard",
      icon: "ni-tv-2 ",
      class: "",
    },
  ];

  constructor(
    private router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.user$.getValue();
    if (!user.isAdmin && !user.isSuperAdmin) {
      this.initialRoute.push(
        // {
        //   path: "/devices",
        //   title: "Device Management",
        //   icon: "fas fa-store",
        //   class: "",
        // },
        {
          path: "/patientManagement",
          title: "Patient Management",
          icon: "fas fa-user",
          class: "",
        },
        {
          path: "/events",
          title: "Events Summary",
          icon: "fas fa-receipt",
          class: "",
        }
      );
    } else if (user.isAdmin) {
      this.initialRoute.push(
        // {
        //   path: "/customers/default",
        //   title: "All Customers",
        //   icon: "fas fa-users icon-rd",
        //   class: "",
        // },
        // {
        //   path: "/customers/privilege",
        //   title: "Privilege Customers",
        //   icon: "fas fa-users icon-rd",
        //   class: "",
        // },
        // {
        //   path: "/customers/regular",
        //   title: "Regular Customers",
        //   icon: "fas fa-users icon-rd",
        //   class: "",
        // },
        // {
        //   path: "/cs",
        //   title: "CS Management",
        //   icon: "fas fa-users",
        //   class: "",
        // },
        // {
        //   path: "/admins",
        //   title: "Admins Management",
        //   icon: "fas fa-users",
        //   class: "",
        // },
        // {
        //   path: "/devices",
        //   title: "Device Management",
        //   icon: "fas fa-store",
        //   class: "",
        // },
        {
          path: "/devices",
          title: "Devices",
          icon: "ni-tv-2",
          class: "",
        },
        {
          path: "/PatientManagement",
          title: "Patient Management",
          icon: "fas fa-user",
          class: "",
        },
        {
          path: "/events",
          title: "Events Summary",
          icon: "fas fa-receipt",
          class: "",
        }
      );
    } else if (user.isSuperAdmin) {
      this.initialRoute.push(
        // {
        //   path: "/admins",
        //   title: "Admins Management",
        //   icon: "fas fa-users",
        //   class: "",
        // },
        // {
        //   path: "/devices",
        //   title: "Device Management",
        //   icon: "fas fa-store",
        //   class: "",
        // },
        {
          path: "/devices",
          title: "Devices",
          icon: "ni-tv-2",
          class: "",
        },
        // {
        //   path: "/cs",
        //   title: "CS Management",
        //   icon: "fas fa-users",
        //   class: "",
        // },
        {
          path: "/PatientManagement",
          title: "Patients Records Management",
          icon: "fas fa-user",
          class: "",
        },
        {
          path: "/events",
          title: "Events Summary",
          icon: "fas fa-receipt",
          class: "",
        }
      );
    }

    this.menuItems = this.initialRoute.filter((menuItem) => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  logout() {
    this.authService.logout();
  }
}
