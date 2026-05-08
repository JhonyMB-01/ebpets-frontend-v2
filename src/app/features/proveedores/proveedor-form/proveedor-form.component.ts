import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../shared/material/material.module';
import { ProveedorService } from '../proveedor.service';
import { Proveedor } from '../../../core/models/proveedor.model';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './proveedor-form.component.html',
  styleUrl: './proveedor-form.component.css'
})
export class ProveedorFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private proveedorService = inject(ProveedorService);
  private snackBar = inject(MatSnackBar);

  modoEdicion = false;
  proveedorId!: number;

  form = this.fb.group({
    nombre: ['', Validators.required],
    ruc: ['', Validators.required],
    telefono: [''],
    email: ['', Validators.email]
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.modoEdicion = true;
        this.proveedorId = params['id'];
        this.cargarProveedor();
      }
    });
  }

  private cargarProveedor(): void {
    this.proveedorService.getProveedorById(this.proveedorId).subscribe(proveedor => {
      this.form.patchValue(proveedor);
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.value as Proveedor;
    if (this.modoEdicion) {
      this.proveedorService.updateProveedor(this.proveedorId, data).subscribe(() => {
        this.snackBar.open('Proveedor actualizado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/proveedores']);
      });
    } else {
      this.proveedorService.createProveedor(data).subscribe(() => {
        this.snackBar.open('Proveedor creado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/proveedores']);
      });
    }
  }

  cancelar(): void {
    if (this.form.dirty) {
      const confirmacion = confirm('¿Desea salir sin guardar los cambios?');
      if (!confirmacion) return;
    } 
    this.router.navigate(['/proveedores']);
  }
    
}
