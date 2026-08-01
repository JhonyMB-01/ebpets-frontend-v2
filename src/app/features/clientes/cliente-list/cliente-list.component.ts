import { Component, OnInit, inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { MaterialModule } from '../../../shared/material/material.module';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css'
})
export class ClienteListComponent {
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  displayedColumns: string[] = [
    'nombre',
    'documento',
    'telefono',
    'email',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Cliente>([]);

  loading = true;
  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes', err);
        this.loading = false;
      }
    });
  }

  nuevoCliente(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  editarCliente(cliente: Cliente): void {
    console.log('Editar cliente', cliente);
    this.router.navigate(['/clientes', cliente.id]);
  }

}
