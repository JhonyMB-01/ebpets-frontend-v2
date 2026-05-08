import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss']
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }

}
