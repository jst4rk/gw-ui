import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

import { catchError, merge, of, tap } from 'rxjs';
import { isEmptyOrNil } from '../common';
import { ConfirmDialogComponent } from '../common/components/confirm-dialog/confirm-dialog.component';
import { IDialogCloseData } from '../common/interfaces';
import { Device } from '../devices/models/device.model';
import { DevicesService } from '../devices/services/devices.service';
import { AddEditGatewayComponent } from './dialogs/add-edit/add-edit.component';

import { GatewaysDataSource } from './gateways-datasource';
import { Gateway } from './models/gateway.model';
import { GatewaysService } from './services/gateways.service';

@Component({
  selector: 'app-gateways',
  templateUrl: './gateways.component.html',
  styleUrls: ['./gateways.component.scss']
})
export class GatewaysComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: GatewaysDataSource;
  devices: Device[] = [];
  displayedColumns = ['serialId', 'name', 'ipv4Address', 'peripheralDevices', 'createdAt', 'actions'];

  constructor(
    private _gatewaysService: GatewaysService,
    private _deviceService: DevicesService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  get params() {
    let sort = `${(this.sort?.direction === 'desc' ? '-' : '')}${this.sort?.active}`;

    if (isEmptyOrNil(this.sort) || isEmptyOrNil(this.sort?.active)) {
      sort = '-createdAt'
    }

    return {
      page: this.paginator?.pageIndex || 0,
      limit: this.paginator?.pageSize || 10,
      sort,
    }
  }

  ngOnInit() {
    this._deviceService.getAll()
      .pipe(catchError(() => of({data: [], meta: { total: 0 } })))
      .subscribe((response) => {
        this.devices = response.data;
      });
    this.dataSource = new GatewaysDataSource(this._gatewaysService);
    this.dataSource.loadGateways(this.params);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadGateways()))
      .subscribe();
  }

  loadGateways() {
    this.dataSource.loadGateways(this.params);
  }

  openAddEditDialog(gatewayData?: Gateway) {
    const matDialogRef = this._dialog.open(AddEditGatewayComponent, {
      width: '550px',
      disableClose: true,
      data: {
        devices: this.devices,
        gatewayData,
      },
    });

    matDialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.dataSource.loadGateways(this.params);
      }
    })
  }

  // This could be in an snackbar service because with use the same function a lot
  openSnackBar(message: string, action = 'OK') {
    this._snackBar.open(message, action, { duration: 4000, verticalPosition: 'top' });
  }

  openDeleteDialog(id: string) {
    const matDialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Gateway',
        message: 'Are you sure you want to delete this gateway?'
      }
    });

    matDialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._gatewaysService.delete(id).subscribe(() => {
          this.openSnackBar('Gateway deleted successfully!');
          this.dataSource.loadGateways(this.params);
        });
      }
    })
  }
}
