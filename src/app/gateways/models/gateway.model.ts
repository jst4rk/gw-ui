import { Device } from "../../devices/models/device.model";

export class Gateway {
  _id: string;
  serialId: string;
  name: string;
  ipv4Address: string;
  peripheralDevices: Device[];
  createdAt: Date;
  updatedAt: Date;

  constructor(gateway: Gateway) {
    gateway = gateway || {}
    this._id = gateway._id || '';
    this.name = gateway.name || '';
    this.serialId = gateway.serialId || '';
    this.ipv4Address = gateway.ipv4Address || '';
    this.peripheralDevices = gateway.peripheralDevices || [];
    this.createdAt = gateway.createdAt || null;
    this.updatedAt = gateway.updatedAt || null;
  }
}
