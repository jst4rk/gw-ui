import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// This could be imported in a shared module
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ConfirmDialogModule } from '../common/components/confirm-dialog/confirm-dialog.module';
import { DevicesComponent } from './devices.component';
import { DevicesService } from './services/devices.service';
import { AddEditDeviceComponent } from './dialogs/add-edit/add-edit.component';

const DevicesRoutes: Route[] = [
  {
    path: '',
    component: DevicesComponent,
  }
];

@NgModule({
  declarations: [
    DevicesComponent,
    AddEditDeviceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DevicesRoutes),
    ConfirmDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [DevicesService]
})
export class DevicesModule { }
