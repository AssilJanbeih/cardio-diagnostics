import * as firebase from "firebase/firestore";

export interface GiftCard {
  id: string;
  customerMemberShipId: number;
  name: string;
  generatedNumber: number;
}
