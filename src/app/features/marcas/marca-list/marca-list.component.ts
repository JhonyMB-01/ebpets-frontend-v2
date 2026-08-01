import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { MaterialModule } from '../../../shared/material/material.module';
import { MarcaService } from '../marca.service';
import { Marca } from '../../../core/models/marca.model';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog';


@Component({
  selector: 'app-marca-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './marca-list.component.html',
  styleUrl: './marca-list.component.css'
})
export class MarcaListComponent  implements OnInit {

  private marcaService = inject(MarcaService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['nombre', 'acciones'];

  dataSource = new MatTableDataSource<Marca>([]);
  loading = true;

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.marcaService.getMarcas().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.loading = false;
      }, error: (err) => {
        console.error('Error al cargar marcas', err);
        this.loading = false;
      }
    });
  }

  nuevo() {
    this.router.navigate(['/marcas/nuevo']);
  }

  editar(c: Marca) {
    this.router.navigate(['/marcas', c.id]);
  }


  eliminar(c: Marca) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        mensaje: `¿Desea eliminar la marca "${c.nombre}"?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        this.marcaService.deleteMarca(c.id)
          .subscribe(() => {

            // ✅ refresco en línea
            this.dataSource.data =
              this.dataSource.data.filter(x => x.id !== c.id);

            this.snackBar.open('Marca eliminada', 'OK', {
              duration: 3000
            });

          });

      }

    });

  }

}
