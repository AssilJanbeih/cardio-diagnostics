import { SharedModule } from "../../../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { EventsRoutes } from "./events.routing";
import { EventFormComponent } from "./event-form/event-form.component";
import { EventsListComponent } from "./events-list/events-list.component";
import { EventsComponent } from "./events/events.component";

@NgModule({
  declarations: [EventsComponent, EventsListComponent, EventFormComponent],
  imports: [RouterModule.forChild(EventsRoutes), SharedModule],
})
export class EventsModule {}
