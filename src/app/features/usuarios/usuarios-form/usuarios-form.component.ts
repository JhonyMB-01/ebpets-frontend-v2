import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import { MaterialModule } from '../../../shared/material/material.module';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../../../core/models/usuario.model';
import { InputFilterDirective } from '../../../shared/directives/input-filter.directive';
import { RolService } from '../../roles/rol.service';
import { Rol } from '../../../core/models/rol.model';

@Component({
  selector: 'app-usuarios-form',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, InputFilterDirective],
  templateUrl: './usuarios-form.component.html',
  styleUrl: './usuarios-form.component.css'
})
export class UsuariosFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  private usuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);
  private rolService = inject(RolService); 

  hidePassword = true;
  
  modoEdicion = false;
  userId!: number;

  roles: Rol[] = [];

  form = this.fb.group({
    nombre: ['', Validators.required],
    username: ['', Validators.required],
    password: [''],
    idRol: [null as number | null, Validators.required],
    activo: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.userId = +id;
      this.modoEdicion = true;

      // En edición la contraseña es opcional
      this.form.get('password')?.clearValidators();
    } else {
      // En creación la contraseña es obligatoria
      this.form.get('password')?.setValidators([Validators.required]);
  }

    this.form.get('password')?.updateValueAndValidity();
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        // ✅ forzar nueva referencia (CRÍTICO)
        this.roles = [...roles];

        // ✅ SOLO AQUÍ cargar producto
        if (this.modoEdicion) {
          this.cargarUsuario();
        }

      },
      error: (err) => console.error('Error cargando roles', err)
    });

  }

  cargarUsuario() {
    console.log('Cargando usuario con ID:', this.userId);
    this.usuarioService.getUsuarioById(this.userId)
          .subscribe({
            next: (usuario: Usuario) => {
    
              this.form.patchValue({
                nombre: usuario.nombre,
                username: usuario.username,
                idRol: usuario.rol?.id ?? null,
                activo: usuario.activo,
                password: usuario.password // No se carga la contraseña por seguridad
              });
    
            },
            error: (err) => console.error(err)
          });

  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = {
      nombre: this.form.value.nombre,
      username: this.form.value.username,
      password: this.form.value.password,
      idRol: this.form.value.idRol,
      activo: this.form.value.activo
    }

    if (this.modoEdicion) {
      // Actualizar usuario
      console.log('Actualizar usuario', dto);
      this.usuarioService.updateUsuario(this.userId, dto).subscribe({
        next: (dto) => {
          this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar usuario',
            text: err.error?.message || 'Ocurrió un error inesperado.',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      // Crear nuevo usuario
      console.log('Crear usuario', dto);
      this.usuarioService.createUsuario(dto).subscribe({
        next: () => {
          this.snackBar.open(
            'Usuario creado correctamente',
            'Cerrar',
            { duration: 3000 }
          );
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear usuario',
              text: err.error?.message || 'Ocurrió un error inesperado.',
              confirmButtonText: 'Aceptar'
            });
          }
      });
    }
   }

   cancelar() {
    if (this.form.dirty) {
      const confirm = window.confirm('¿Estás seguro de que deseas cancelar? Los cambios no se guardarán.');
      if (!confirm) return;
    }
    this.router.navigate(['/usuarios']);
  }

}
