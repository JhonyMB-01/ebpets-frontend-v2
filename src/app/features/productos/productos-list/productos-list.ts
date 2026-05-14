import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { MaterialModule } from '../../../shared/material/material.module';
import { ProductoService } from '../producto.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './productos-list.html',
  styleUrls: ['./productos-list.scss']
})
export class ProductosListComponent implements OnInit {

  private productoService = inject(ProductoService);
  private router = inject(Router);

  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'categoria',
    'marca',
    'precioVenta',
    'activo',
    'afectaIgv',
    'acciones'
    
  ];

  dataSource = new MatTableDataSource<Producto>([]);

  loading = true;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;

    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.loading = false;
      }
    });
  }

  nuevoProducto(): void {
    this.router.navigate(['/productos/nuevo']);
  }

  editarProducto(producto: Producto): void {
    console.log('Editar', producto);
    // luego:
     this.router.navigate(['/productos', producto.id]);
  }

}