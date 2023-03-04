export interface Customer {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  nationality: string;
  //qatarId: string;
  passportOrID: string;
  receiptsValue: string;
  labels: string;
  is_enabled: boolean;
  // generatedDigit: number;
  // memberType: string;
  // qatarAirwaysNumber?: string;
  age: string;
  dob: any;
  email: string;
  gender: string;
  dateCreated?: any;
}
