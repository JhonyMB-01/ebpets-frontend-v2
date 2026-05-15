
import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { MaterialModule } from '../../../shared/material/material.module';

import { CompraService } from '../compra.service';
import { CompraDetalle } from '../../../core/models/compra.model';


@Component({
  selector: 'app-compra-detail-dialog',
  imports: [CommonModule, MatDialogModule, MaterialModule],
  templateUrl: './compra-detail-dialog.component.html',
  styleUrls: ['./compra-detail-dialog.component.css']
})
export class CompraDetailDialogComponent implements OnInit{
  
private service = inject(CompraService);

  compra!: CompraDetalle;
  loading = true;

  displayedColumns: string[] = [
  'producto',
  'cantidad',
  'precio',
  'lote',
  'vencimiento'
];

 
  // ✅ id recibido desde dialog
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}


  ngOnInit(): void {
     this.cargarDetalle();
  }

  
// ✅ cargar compra
  cargarDetalle(): void {

    this.loading = true;

    this.service.getCompraById(this.data.id).subscribe({
      next: (res) => {

        console.log('Detalle compra:', res);

        // forzar referencia nueva (evita bugs Angular)
        this.compra = { ...res };

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando detalle', err);
        this.loading = false;
      }
    });
  }




}
