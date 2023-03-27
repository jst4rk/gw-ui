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

import { ConfirmDialogModule } from '../common/components/confirm-dialog/confirm-dialog.module';
import { GatewaysComponent } from './gateways.component';
import { GatewaysService } from './services/gateways.service';
import { AddEditGatewayComponent } from './dialogs/add-edit/add-edit.component';
import { DevicesService } from '../devices/services/devices.service';

const GatewaysRoutes: Route[] = [
  {
    path: '',
    component: GatewaysComponent,
  }
];

@NgModule({
  declarations: [
    GatewaysComponent,
    AddEditGatewayComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(GatewaysRoutes),
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
  ],
  providers: [GatewaysService, DevicesService]
})
export class GatewaysModule { }
