import { SharedModule } from "./shared/shared.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import {
  ScreenTrackingService,
  UserTrackingService,
} from "@angular/fire/analytics";

import { AuthService } from "./services/auth.service";
import { AngularFireModule } from "@angular/fire/compat";
import { BrowserModule } from "@angular/platform-browser";
import { MAT_DATE_LOCALE } from "@angular/material/core/datetime";



@NgModule({
  imports: [
    ComponentsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    AppRoutingModule,
    MatInputModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDpIqBQULEwXMTSvXnZfRstpT1DSaEJh-8",
      authDomain: "cardio-diagnostics-se.firebaseapp.com",
      projectId: "cardio-diagnostics-se",
      storageBucket: "cardio-diagnostics-se.appspot.com",
      messagingSenderId: "574402725541",
      appId: "1:574402725541:web:26b14af13c7ab8332baf4c",
      measurementId: "G-57BEQQQDKP"
    }),
    SharedModule,
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    AuthService,
    // {
    //   provide: AUTH_SETTINGS,
    //   useValue: { appVerificationDisabledForTesting: true },
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
