import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../shared/material/material.module';
import { RolService } from '../rol.service';
import { Rol } from '../../../core/models/rol.model';
import { InputFilterDirective } from '../../../shared/directives/input-filter.directive';


@Component({
  selector: 'app-rol-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, InputFilterDirective],
  templateUrl: './rol-form.component.html',
  styleUrl: './rol-form.component.css'
})
export class RolFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(RolService);
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
          //this.cargar();
        }
    }

      guardar() {      
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
          }
        
          const data = this.form.value as Rol;
        
            this.service.createRole(data)
              .subscribe(() => {
              
                this.snackBar.open('✅ Rol creado', 'Cerrar', {
                  duration: 3000
                });
              
                this.router.navigate(['/roles']);
              });
      }


    cancelar() {
       
     if (this.form.dirty) {
    
        const confirmacion = confirm('¿Desea salir sin guardar los cambios?');
    
        if (!confirmacion) return;
      }
    
      this.router.navigate(['/roles']);
    
      }

}
