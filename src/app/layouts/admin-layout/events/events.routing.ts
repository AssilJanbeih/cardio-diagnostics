import { EventsListComponent } from "./events-list/events-list.component";
import { EventsComponent } from "./events/events.component";
import { Routes } from "@angular/router";

export const EventsRoutes: Routes = [
  {
    path: "",
    component: EventsComponent,
    children: [{ path: "", component: EventsListComponent }],
  },
];
