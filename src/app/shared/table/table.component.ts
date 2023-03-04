import { ConfirmationDialogComponent } from "./../confirmation-dialog/confirmation-dialog.component";
import { MatTableDataSource } from "@angular/material/table";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";

export interface DisplayedColumns<T> {
  header: string;
  columnDef: string;
  cell: (element: T) => string;
}

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent<T> implements OnInit, AfterViewInit, OnChanges {
  @Input() columns: DisplayedColumns<T>[];
  @Input() dataSource: T[];
  @Input() canEdit: boolean;
  @Input() canEnable: boolean;
  @Input() canDelete: boolean;
  @Input() haveStatistic: boolean;
  @Output() onEdit: EventEmitter<T> = new EventEmitter<T>();
  @Output() onDelete: EventEmitter<T> = new EventEmitter<T>();
  @Output() onEnableDisable: EventEmitter<T> = new EventEmitter<T>();
  @Output() onStatisticClick: EventEmitter<T> = new EventEmitter<T>();
  @Output() onRowClicked: EventEmitter<T> = new EventEmitter<T>();
  data: MatTableDataSource<T>;
  displayedColumns: string[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchValue: string;
  // clickedRows = new Set<T>();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.displayedColumns = this.columns.map((c) => c.columnDef);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSource && changes.dataSource.currentValue) {
      this.data = new MatTableDataSource(this.dataSource);
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
    }
  }

  ngAfterViewInit() {}

  applyFilter() {
    const filterValue = this.searchValue;
    this.data.filter = filterValue.trim().toLowerCase();
    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }

  editRow(data: T, event: Event) {
    event.stopPropagation();

    this.onEdit.emit(data);
  }

  clickRow(data: T) {
    // this.clickedRows.add(data);
    this.onRowClicked.emit(data);
  }

  enableDisableRow(data: T, event: Event) {
    event.stopPropagation();
    this.onEnableDisable.emit(data);
  }

  deleteRow(data: T, event: Event) {
    event.stopPropagation();
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: "250px",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == "yes") {
          this.onDelete.emit(data);
        }
      });
  }

  // getStatistic(data: T, event: Event) {
  //   event.stopPropagation();
  //   this.onStatisticClick.emit(data);
  // }
}
