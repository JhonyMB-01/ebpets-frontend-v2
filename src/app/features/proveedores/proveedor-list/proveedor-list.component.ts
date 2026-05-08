import { Component, OnInit, inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { MaterialModule } from '../../../shared/material/material.module';
import { ProveedorService } from '../proveedor.service';
import { Proveedor } from '../../../core/models/proveedor.model';

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './proveedor-list.component.html',
  styleUrl: './proveedor-list.component.css'
})
export class ProveedorListComponent {
  private proveedorService = inject(ProveedorService);
  private router = inject(Router);

  displayedColumns: string[] = [
    'nombre',
    'ruc',
    'telefono',
    'email',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Proveedor>([]);

  loading = true;
  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.loading = true;
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar proveedores', err);
        this.loading = false;
      }
    });
  }

  nuevoProveedor(): void {
    this.router.navigate(['/proveedores/nuevo']);
  }

  editarProveedor(proveedor: Proveedor): void {
    console.log('Editar proveedor', proveedor);
    this.router.navigate(['/proveedores', proveedor.id]);
  }

}
