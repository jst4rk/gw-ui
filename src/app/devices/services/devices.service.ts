import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IListResponse } from 'src/app/common/interfaces';
import { Device } from '../models/device.model';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  devicesApiUrl!: string;

  constructor(private _httpClient: HttpClient) {
    this.devicesApiUrl = `${env.apiUrl}/devices`;
  }

  getAll(params: any = {}): Observable<IListResponse<Device[]>> {
    return this._httpClient.get(this.devicesApiUrl, { params }) as Observable<IListResponse<Device[]>>;
  }

  create(device: Device) {
    return this._httpClient.post(`${this.devicesApiUrl}`, device);
  }

  edit(id: string, deviceData: Partial<Device>) {
    return this._httpClient.patch(`${this.devicesApiUrl}/${id}`, deviceData);
  }

  delete(id: string) {
    return this._httpClient.delete(`${this.devicesApiUrl}/${id}`);
  }
}
