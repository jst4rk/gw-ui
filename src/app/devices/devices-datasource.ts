import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { Device } from "./models/device.model";
import { DevicesService } from "./services/devices.service";

export class DevicesDataSource implements DataSource<Device[]> {
  private devicesSubject = new BehaviorSubject<any[]>([]);
  private metaSubject = new BehaviorSubject<{ total: number }>({ total: 0 });
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private _devicesService: DevicesService) {
  }

  connect(): Observable<readonly any[]> {
    return this.devicesSubject.asObservable();
  }

  disconnect(): void {
    this.devicesSubject.complete();
    this.loadingSubject.complete();
  }

  loadDevices(params = {}) {
    this.loadingSubject.next(true);

    this._devicesService.getAll(params)
      .pipe(
        catchError(() => of({ data: [], meta: { total: 0 } })),
        finalize(() => this.loadingSubject.next(false)),
      ).subscribe((devicesResponse) => {
        this.devicesSubject.next(devicesResponse.data);
        this.metaSubject.next(devicesResponse.meta);
      });
  }

  get meta$() {
    return this.metaSubject.asObservable();
  }

}
