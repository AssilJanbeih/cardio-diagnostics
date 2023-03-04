import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { ClipboardModule } from "ngx-clipboard";
import { SwiperModule } from "swiper/angular";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { TableComponent } from "./table/table.component";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from "@angular/material/radio";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";

@NgModule({
  declarations: [TableComponent, ConfirmationDialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
    NgbModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatTableModule,
    SwiperModule,
    ClipboardModule,
    MatDialogModule,
    MatRadioModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    RouterModule,
    MatTableModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    HttpClientModule,
    MatIconModule,
    MatFormFieldModule,
    TableComponent,
    NgbModule,
    SwiperModule,
    ClipboardModule,
    MatSnackBarModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    ConfirmationDialogComponent,
  ],
})
export class SharedModule {}
