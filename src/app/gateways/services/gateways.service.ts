import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IListResponse } from '../../common/interfaces';
import { Gateway } from '../models/gateway.model';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GatewaysService {
  gatewaysApiUrl!: string;

  constructor(private _httpClient: HttpClient) {
    this.gatewaysApiUrl = `${env.apiUrl}/gateways`;
  }

  getAll(params: any): Observable<IListResponse<Gateway[]>> {
    return this._httpClient.get(this.gatewaysApiUrl, { params }) as Observable<IListResponse<Gateway[]>>;
  }

  create(gateway: Gateway) {
    return this._httpClient.post(`${this.gatewaysApiUrl}`, gateway);
  }

  edit(id: string, gatewayData: Partial<Gateway>) {
    return this._httpClient.patch(`${this.gatewaysApiUrl}/${id}`, gatewayData);
  }

  delete(id: string) {
    return this._httpClient.delete(`${this.gatewaysApiUrl}/${id}`);
  }
}
