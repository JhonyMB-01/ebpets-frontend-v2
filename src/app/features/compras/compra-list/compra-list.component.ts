import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../shared/material/material.module';

import { CompraService } from '../compra.service';
import { Compra } from '../../../core/models/compra.model';

import { MatDialog } from '@angular/material/dialog';
import { CompraDetailDialogComponent } from '../compra-detail-dialog/compra-detail-dialog.component';



@Component({
  selector: 'app-compra-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './compra-list.component.html',
  styleUrl: './compra-list.component.css'
})
export class CompraListComponent implements OnInit{

  
  private service = inject(CompraService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);


  displayedColumns: string[] = ['id', 'proveedor', 'fecha', 'total', 'acciones'];
  
 dataSource = new MatTableDataSource<Compra>([]);
   loading = true;


  ngOnInit(): void {
    this.cargar();
  }

  
cargar() {
    this.service.getCompras().subscribe({
        next: (data) => {
          this.dataSource = new MatTableDataSource(data);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar compras', error);
          this.loading = false;
        }
      });
  }

  nuevaCompra() {
    this.router.navigate(['/compras/nuevo']);
  }

  verDetalle(id: number) {
    console.log('Ver detalle de compra con ID:', id);
    this.dialog.open(CompraDetailDialogComponent, {
      width: '80%',             // ancho relativo
      maxWidth: '1200px',       // límite máximo
      height: '80%',            // altura relativa
      data: { id }
    });
  }

 


}
