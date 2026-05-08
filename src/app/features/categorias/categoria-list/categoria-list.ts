import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatTableDataSource } from '@angular/material/table';

import { MaterialModule } from '../../../shared/material/material.module';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../../../core/models/categoria.model';


import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog';


@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './categoria-list.html',
  styleUrls: ['./categoria-list.scss']
})
export class CategoriaListComponent implements OnInit {

  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['nombre', 'descripcion', 'acciones'];

  dataSource = new MatTableDataSource<Categoria>([]);
  loading = true;

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        console.log('Categorías cargadas:', data);
        this.dataSource = new MatTableDataSource(data);
        this.loading = false;
        console.log(this.loading);
      }, error: (err) => {
        console.error('Error al cargar categorías', err);
        this.loading = false;
      }
    });
  }

  nuevo() {
    this.router.navigate(['/categorias/nuevo']);
  }

  editar(c: Categoria) {
    this.router.navigate(['/categorias', c.id]);
  }


  eliminar(c: Categoria) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        mensaje: `¿Desea eliminar la categoría "${c.nombre}"?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        this.categoriaService.deleteCategoria(c.id)
          .subscribe(() => {

            // ✅ refresco en línea
            this.dataSource.data =
              this.dataSource.data.filter(x => x.id !== c.id);

            this.snackBar.open('Categoría eliminada', 'OK', {
              duration: 3000
            });

          });

      }

    });

  }

}