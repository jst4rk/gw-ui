import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { Gateway } from "./models/gateway.model";
import { GatewaysService } from "./services/gateways.service";

export class GatewaysDataSource implements DataSource<Gateway[]> {
  private gatewaysSubject = new BehaviorSubject<any[]>([]);
  private metaSubject = new BehaviorSubject<{ total: number }>({ total: 0 });
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private _gatewaysService: GatewaysService) {
  }

  connect(): Observable<readonly any[]> {
    return this.gatewaysSubject.asObservable();
  }

  disconnect(): void {
    this.gatewaysSubject.complete();
    this.loadingSubject.complete();
  }

  loadGateways(params = {}) {
    this.loadingSubject.next(true);

    this._gatewaysService.getAll(params)
      .pipe(
        catchError(() => of({ data: [], meta: { total: 0 } })),
        finalize(() => this.loadingSubject.next(false)),
      ).subscribe((gatewaysResponse) => {
        this.gatewaysSubject.next(gatewaysResponse.data);
        this.metaSubject.next(gatewaysResponse.meta);
      });
  }

  get meta$() {
    return this.metaSubject.asObservable();
  }

}
