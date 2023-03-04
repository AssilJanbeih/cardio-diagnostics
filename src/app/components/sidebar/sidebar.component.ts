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
        {
          path: "/stores",
          title: "Store Management",
          icon: "fas fa-store",
          class: "",
        },
        {
          path: "/shopandwincustomers",
          title: "Users Management",
          icon: "fas fa-user",
          class: "",
        },
        {
          path: "/invoices",
          title: "Invoices Summary",
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
        {
          path: "/cs",
          title: "CS Management",
          icon: "fas fa-users",
          class: "",
        },
        {
          path: "/admins",
          title: "Admins Management",
          icon: "fas fa-users",
          class: "",
        },
        {
          path: "/stores",
          title: "Store Management",
          icon: "fas fa-store",
          class: "",
        },
        {
          path: "/campaigns",
          title: "Campaigns",
          icon: "fas fa-store",
          class: "",
        },
        {
          path: "/shopandwincustomers",
          title: "Users Management",
          icon: "fas fa-user",
          class: "",
        },
        {
          path: "/invoices",
          title: "Invoices Summary",
          icon: "fas fa-receipt",
          class: "",
        }
      );
    } else if (user.isSuperAdmin) {
      this.initialRoute.push(
        {
          path: "/admins",
          title: "Admins Management",
          icon: "fas fa-users",
          class: "",
        },
        {
          path: "/stores",
          title: "Store Management",
          icon: "fas fa-store",
          class: "",
        },
        {
          path: "/campaigns",
          title: "Campaigns",
          icon: "fas fa-store",
          class: "",
        },
        {
          path: "/cs",
          title: "CS Management",
          icon: "fas fa-users",
          class: "",
        },
        {
          path: "/shopandwincustomers",
          title: "Users Management",
          icon: "fas fa-user",
          class: "",
        },
        {
          path: "/invoices",
          title: "Invoices Summary",
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
