import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface IConfirmDialog {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IConfirmDialog) {}

  get title() {
    return this.data?.title || 'Confirmation Dialog';
  }

  get message() {
    return this.data?.message || 'Are you sure you want to do this action?';
  }
}
