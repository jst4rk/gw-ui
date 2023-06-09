import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, catchError, Subject, takeUntil, throwError } from 'rxjs';

import {
  isValid,
  isEmptyOrNil,
  handleResponseErrorsMsg,
} from '../../../common';
import { Device } from '../../../devices/models/device.model';
import { DevicesService } from '../../services/devices.service';

@Component({
  selector: 'app-devices-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditDeviceComponent implements OnInit, OnDestroy {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  addEditForm!: FormGroup;
  selectedPeriphericalDevices: string[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { deviceData: Device },
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AddEditDeviceComponent>,
    private _devicesService: DevicesService,
  ) {}

  public loading$ = this.loadingSubject.asObservable();

  get isEditMode() {
    return !isEmptyOrNil(this.data.deviceData);
  }

  get controls() {
    return this.addEditForm.controls;
  }


  ngOnInit(): void {
    this.addEditForm = this._fb.group({
      uid: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      vendor: ['', Validators.required],
      createdAt: ['', Validators.required],
      status: ['', Validators.required],
    });

    if (this.isEditMode) {
      this.addEditForm.patchValue(this.data.deviceData);
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

  addSaveDevice() {
    if (!isValid(this.addEditForm)) {
      this.openSnackBar('Please enter all required fields');
      return;
    }

    const formData = this.addEditForm.value;
    this.loadingSubject.next(true);
    switch (this.isEditMode) {
      case true:
        this._devicesService.edit(this.data.deviceData._id, formData)
          .pipe(catchError((error: HttpErrorResponse) => {
            this.openSnackBar(handleResponseErrorsMsg(error));
            return throwError(() => error);
          }))
          .subscribe(() => {
            this.openSnackBar('Device Edited Successfully');
            this.loadingSubject.next(false);
            this._dialogRef.close('edit');
          });
        break;

      default:
        this._devicesService.create(formData)
          .pipe(catchError((error: HttpErrorResponse) => {
            this.openSnackBar(handleResponseErrorsMsg(error));
            return throwError(() => error);
          }))
          .subscribe(() => {
            this.openSnackBar('Device Created Successfully');
            this.loadingSubject.next(false);
            this._dialogRef.close('add');
          });
        break;
    }

  }

}
