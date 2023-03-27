import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { find } from 'lodash-es';
import { BehaviorSubject, catchError, Subject, takeUntil, throwError } from 'rxjs';

import { MAX_DEVICE_ALLOWED } from '../../../common';

import {
  isValid,
  isEmptyOrNil,
  handleResponseErrorsMsg,
  CustomValidators
} from '../../../common';
import { Device } from '../../../devices/models/device.model';
import { Gateway } from '../../models/gateway.model';
import { GatewaysService } from '../../services/gateways.service';

@Component({
  selector: 'app-gateways-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditGatewayComponent implements OnInit, OnDestroy {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  addEditForm!: FormGroup;
  selectedPeriphericalDevices: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { gatewayData: Gateway, devices: Device[] },
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AddEditGatewayComponent>,
    private _gatewaysService: GatewaysService,
  ) {}

  public loading$ = this.loadingSubject.asObservable();

  get isEditMode() {
    return !isEmptyOrNil(this.data.gatewayData);
  }

  get controls() {
    return this.addEditForm.controls;
  }

  get peripheralDevices() {
    return this.data.devices || [];
  }

  get maxDevices() {
    return MAX_DEVICE_ALLOWED;
  }

  ngOnInit(): void {
    this.addEditForm = this._fb.group({
      name: ['', Validators.required],
      serialId: ['', Validators.required],
      ipv4Address: ['', [Validators.required, CustomValidators.ipv4]],
      peripheralDevices: [''],
    });

    if (this.isEditMode) {
      const { peripheralDevices, ...restGatewayData } = this.data.gatewayData;
      this.addEditForm.patchValue({
        // Temporally until I changed to a multi select
        peripheralDevices: peripheralDevices.map(device => device._id),
        ...restGatewayData
      });
    }

    this.loading$.pipe(takeUntil(this._unsubscribeAll)).subscribe((loading) => {
      loading ? this.addEditForm.disable() : this.addEditForm.enable();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete()
  }

  openSnackBar(message: string, action = 'OK') {
    this._snackBar.open(message, action, { duration: 4000, verticalPosition: 'top' });
  }

  addSaveGateway() {
    if (!isValid(this.addEditForm)) {
      this.openSnackBar('Please enter all required fields');
      return;
    }

    const formData = this.addEditForm.value;
    this.loadingSubject.next(true);
    switch (this.isEditMode) {
      case true:
        this._gatewaysService.edit(this.data.gatewayData._id, formData)
          .pipe(catchError((error: HttpErrorResponse) => {
            this.openSnackBar(handleResponseErrorsMsg(error));
            return throwError(() => error);
          }))
          .subscribe(() => {
            this.openSnackBar('Gateway Edited Successfully');
            this.loadingSubject.next(false);
            this._dialogRef.close('edit');
          });
        break;

      default:
        this._gatewaysService.create(formData)
          .pipe(catchError((error: HttpErrorResponse) => {
            this.openSnackBar(handleResponseErrorsMsg(error));
            return throwError(() => error);
          }))
          .subscribe(() => {
            this.openSnackBar('Gateway Created Successfully');
            this.loadingSubject.next(false);
            this._dialogRef.close('add');
          });
        break;
    }

  }

  getDeviceLabel(id: string) {
    return find(this.peripheralDevices, { _id: id })?.vendor || '';
  }

  checkLimit(event: MatSelectChange) {
    this.selectedPeriphericalDevices = event.value;
  }

  disableOption(id: string = '') {
    if (this.selectedPeriphericalDevices.length === MAX_DEVICE_ALLOWED) {
      return !this.selectedPeriphericalDevices.includes(id);
    }

    return false;
  }
}
