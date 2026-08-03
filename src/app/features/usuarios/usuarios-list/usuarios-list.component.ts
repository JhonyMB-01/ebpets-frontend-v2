import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatTableDataSource } from '@angular/material/table';

import { MaterialModule } from '../../../shared/material/material.module';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../../../core/models/usuario.model';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog';


@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.css'
})
export class UsuariosListComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['nombre', 'username', 'rol', 'activo', 'acciones'];

  dataSource = new MatTableDataSource<Usuario>([]);
  loading = true;

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.loading = false;
      }, error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.loading = false;
      }
    });
  }

  nuevo() {
    this.router.navigate(['/usuarios/nuevo']);
  }

  editar(u: Usuario) {
    this.router.navigate(['/usuarios', u.id]);
  }

  eliminar(u: Usuario) {
    console.log('Eliminar usuario', u);

  }


}
