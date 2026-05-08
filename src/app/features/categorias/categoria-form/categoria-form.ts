import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../shared/material/material.module';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './categoria-form.html',
  styleUrls: ['./categoria-form.scss']
})
export class CategoriaFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);

  modoEdicion = false;
  id!: number;

  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id = +id;
      this.modoEdicion = true;
      this.cargar();
    }
  }

  cargar() {
    this.service.getCategoriaById(this.id).subscribe(data => {
      this.form.patchValue(data);
    });
  }

  guardar() {
   
    if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      const data = this.form.value as Categoria;

      if (this.modoEdicion) {

        this.service.updateCategoria(this.id, data)
          .subscribe(() => {

            this.snackBar.open('✅ Categoría actualizada', 'Cerrar', {
              duration: 3000
            });

            this.router.navigate(['/categorias']);
          });

      } else {

        this.service.createCategoria(data)
          .subscribe(() => {

            this.snackBar.open('✅ Categoría creada', 'Cerrar', {
              duration: 3000
            });

            this.router.navigate(['/categorias']);
          });

      }


  }

  cancelar() {
   
    if (this.form.dirty) {
        const confirmacion = confirm('¿Desea salir sin guardar los cambios?');
        if (!confirmacion) return;
      }
      this.router.navigate(['/categorias']);

  }
}