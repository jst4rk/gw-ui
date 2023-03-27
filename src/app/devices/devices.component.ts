import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

import { catchError, merge, of, tap } from 'rxjs';

import { isEmptyOrNil } from '../common';
import { ConfirmDialogComponent } from '../common/components/confirm-dialog/confirm-dialog.component';
import { DevicesDataSource } from './devices-datasource';
import { AddEditDeviceComponent } from './dialogs/add-edit/add-edit.component';
import { Device } from './models/device.model';
import { DevicesService } from './services/devices.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: DevicesDataSource;
  devices: Device[] = [];
  displayedColumns = ['uid', 'vendor', 'status', 'createdAt', 'updatedAt', 'actions'];

  constructor(
    private _devicesService: DevicesService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  get params() {
    let sort = `${(this.sort?.direction === 'desc' ? '-' : '')}${this.sort?.active}`;

    if (isEmptyOrNil(this.sort)) {
      sort = '-createdAt'
    }

    return {
      page: this.paginator?.pageIndex || 0,
      limit: this.paginator?.pageSize || 10,
      sort,
    }
  }

  ngOnInit() {
    this._devicesService.getAll()
      .pipe(catchError(() => of({data: [], meta: { total: 0 } })))
      .subscribe((response) => {
        this.devices = response.data;
      });
    this.dataSource = new DevicesDataSource(this._devicesService);
    this.dataSource.loadDevices(this.params);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadDevices()))
      .subscribe();
  }

  loadDevices() {
    this.dataSource.loadDevices(this.params);
  }

  openAddEditDialog(gatewayData?: Device) {
    const matDialogRef = this._dialog.open(AddEditDeviceComponent, {
      width: '550px',
      disableClose: true,
      data: {
        devices: this.devices,
        gatewayData,
      },
    });

    matDialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.dataSource.loadDevices(this.params);
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
        title: 'Delete Device',
        message: 'Are you sure you want to delete this device?'
      }
    });

    matDialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._devicesService.delete(id).subscribe(() => {
          this.openSnackBar('Device deleted successfully!');
          this.dataSource.loadDevices(this.params);
        });
      }
    })
  }
}
