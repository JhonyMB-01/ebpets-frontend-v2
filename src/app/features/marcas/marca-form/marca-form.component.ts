import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../shared/material/material.module';
import { MarcaService } from '../marca.service';
import { Marca } from '../../../core/models/marca.model';

@Component({
  selector: 'app-marca-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './marca-form.component.html',
  styleUrl: './marca-form.component.css'
})
export class MarcaFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private service = inject(MarcaService);
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
        this.service.getMarcaById(this.id).subscribe(data => {
          this.form.patchValue(data);
        });
      }
    
      guardar() {
       
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
          }
    
          const data = this.form.value as Marca;
    
          if (this.modoEdicion) {
    
            this.service.updateMarca(this.id, data)
              .subscribe(() => {
    
                this.snackBar.open('✅ Marca actualizada', 'Cerrar', {
                  duration: 3000
                });
    
                this.router.navigate(['/marcas']);
              });
    
          } else {
    
            this.service.createMarca(data)
              .subscribe(() => {
    
                this.snackBar.open('✅ Marca creada', 'Cerrar', {
                  duration: 3000
                });
    
                this.router.navigate(['/marcas']);
              });
    
          }
    
    
      }
    
      cancelar() {
       
     if (this.form.dirty) {
    
        const confirmacion = confirm('¿Desea salir sin guardar los cambios?');
    
        if (!confirmacion) return;
      }
    
      this.router.navigate(['/marcas']);
    
      }
}