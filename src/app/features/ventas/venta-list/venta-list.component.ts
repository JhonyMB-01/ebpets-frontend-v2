import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../shared/material/material.module';


import { VentaService } from '../venta.service';
import { Venta } from '../../../core/models/venta.model';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog';
import { VentaDetailDialogComponent } from '../venta-detail-dialog/venta-detail-dialog.component';


@Component({
  selector: 'app-venta-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './venta-list.component.html',
  styleUrl: './venta-list.component.css'
})
export class VentaListComponent implements OnInit {

  private service = inject(VentaService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  displayedColumns = ['id', 'cliente', 'vendedor', 'fecha', 'total', 'estado', 'acciones'];

  dataSource = new MatTableDataSource<Venta>([]);
  loading = true;


  ngOnInit(): void {
    this.cargar();
  }


  cargar(): void {

    this.loading = true;

    this.service.getVentas().subscribe({
      next: (data) => {
        this.dataSource.data = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando ventas', err);
        this.loading = false;
      }
    });

  }

  
  nuevaVenta(): void {
    this.router.navigate(['/ventas/nuevo']);
  }

  aprobarPago(id: number): void {
    console.log('Aprobar pago venta con ID', id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '400px',
          data: {
            mensaje: `¿Desea aprobar el pago de la venta?`
          }
        });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Lógica para aprobar el pago
        console.log('Pago aprobado para la venta con ID', id);
        this.service.confirmarPago(id).subscribe({
          next: () => {
            console.log('Pago confirmado en el backend');
            // Refrescar la lista de ventas después de aprobar el pago
            this.cargar();
          }
        });
      } else {
        console.log('Aprobación de pago cancelada');
      } 
    });

    
        
  }

  
  verDetalle(id: number): void {
    console.log('Ver detalle venta con ID', id);
    this.dialog.open(VentaDetailDialogComponent, {
      width: '80%',             // ancho relativo
      maxWidth: '1200px',       // límite máximo
      height: '80%',            // altura relativa
      data: { id }
    });
  }


}
