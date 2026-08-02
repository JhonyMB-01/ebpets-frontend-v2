import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { MaterialModule } from '../../../shared/material/material.module';
import { RolService } from '../rol.service';
import { Rol } from '../../../core/models/rol.model';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-rol-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './rol-list.component.html',
  styleUrl: './rol-list.component.css'
})
export class RolListComponent implements OnInit {

  private rolService = inject(RolService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['nombre', 'acciones'];
  dataSource = new MatTableDataSource<Rol>([]);
  loading = true;

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.rolService.getRoles().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.loading = false;
      }, error: (err) => {
        console.error('Error al cargar roles', err);
        this.loading = false;
      }
    });
  }

  nuevo() {
    this.router.navigate(['/roles/nuevo']);
  }

  editar(c: Rol) {
      this.router.navigate(['/roles', c.id]);
    }

  eliminar(c: Rol) {
  
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          mensaje: `¿Desea eliminar el rol "${c.nombre}"?`
        }
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
  
          this.rolService.deleteRole(c.id)
            .subscribe(() => {
  
              // ✅ refresco en línea
              this.dataSource.data =
                this.dataSource.data.filter(x => x.id !== c.id);
  
              this.snackBar.open('Rol eliminado', 'OK', {
                duration: 3000
              });
  
            });
  
        }
  
      });
  }

}
