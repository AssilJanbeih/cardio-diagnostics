export interface Event {
  id: string;
  customerName?: string;
  deviceId?: string;
  deviceName?: string;
  deviceValue?: number;
  heartRate?: number;
  dateCreated?: any;
  eventId: string;
  createdBy: string;
  updatedBy: string;
  updatedAt?: any;
  customerId: string;
  customerUniqueId: string;
  type?: number;
}
