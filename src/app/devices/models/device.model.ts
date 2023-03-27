export class Device {
  _id: string;
  uid: number;
  vendor: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(device: Device) {
    this._id = device._id || '';
    this.uid = device.uid || -1;
    this.vendor = device.vendor || '';
    this.status = device.status || '';
    this.createdAt = device.createdAt || null;
    this.updatedAt = device.updatedAt || null;
  }
}
