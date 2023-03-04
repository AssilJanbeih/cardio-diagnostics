import * as firebase from "firebase/firestore";

export interface CustomerInvoices {
  id: string;
  name: string;
  totalInvoices: number;
  totalNumberOfLabels: number;
}
