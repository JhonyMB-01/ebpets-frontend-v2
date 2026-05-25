import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { MaterialModule } from '../../../shared/material/material.module';

import { VentaService } from '../venta.service';
import { VentaDetalle } from '../../../core/models/venta.model';


@Component({
  selector: 'app-venta-detail-dialog',
  imports: [CommonModule, MatDialogModule, MaterialModule],
  standalone: true,
  templateUrl: './venta-detail-dialog.component.html',
  styleUrl: './venta-detail-dialog.component.css'
})
export class VentaDetailDialogComponent implements OnInit {

  
private service = inject(VentaService);

  venta!: VentaDetalle;
  loading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number }) {}

  ngOnInit(): void {
   this.cargar();
  }

  
cargar(): void {

    this.loading = true;

    this.service.getVentaById(this.data.id).subscribe({
      next: (res) => {

        console.log('Detalle venta:', res);

        // ✅ evitar bug render
        this.venta = { ...res };

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando detalle', err);
        this.loading = false;
      }
    });

  }


}
