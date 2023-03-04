import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import * as firebase from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class ExcelService {
  constructor() {}

  importFromFile(bstr: string): XLSX.AOA2SheetOpts {
    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    const data = <XLSX.AOA2SheetOpts>(
      XLSX.utils.sheet_to_json(ws, { header: 1 })
    );

    return data;
  }

  exportExcel(data, fileName) {
    // debugger;
    data.forEach((element) => {
      if (element.dateCreated) {
        // console.log(firebase.Timestamp.fromDate(new Date(element.dateCreated)));
        element.dateCreated = new firebase.Timestamp(
          element.dateCreated.seconds,
          element.dateCreated.nanoseconds
        )
          .toDate()
          .toDateString();
      }
      const keys = Object.keys(element);
      keys.forEach((key) => {
        if (element[key] instanceof Array) {
          element[key] = element[key].join(",");
        }
      });
    });

    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data); // Sale Data
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveAsExcelFile(excelBuffer, fileName);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then((FileSaver) => {
      const EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      saveAs(
        data,
        fileName + "_export_" + new Date().toLocaleString() + EXCEL_EXTENSION
      );
    });
  }
}
