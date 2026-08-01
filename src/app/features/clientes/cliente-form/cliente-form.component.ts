import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../shared/material/material.module';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../../../core/models/cliente.model';
import { InputFilterDirective } from '../../../shared/directives/input-filter.directive';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    InputFilterDirective
  ],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private snackBar = inject(MatSnackBar);

  modoEdicion = false;
  clienteId!: number;

  form = this.fb.group({
    nombre: ['', Validators.required],
    documento: ['', Validators.required],
    telefono: [''],
    email: ['', Validators.email]
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.modoEdicion = true;
        this.clienteId = params['id'];
        this.cargarCliente();
      }
    });
  }

  private cargarCliente(): void {
    this.clienteService.getClienteById(this.clienteId).subscribe(cliente => {
      this.form.patchValue(cliente);
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.value as Cliente;
    console.log("Actualizar: "+data.documento + " "+ this.clienteId);
    if (this.modoEdicion) {
      this.clienteService.updateCliente(this.clienteId, data).subscribe(() => {
        this.snackBar.open('Cliente actualizado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/clientes']);
      });
    } else {
      this.clienteService.createCliente(data).subscribe(() => {
        this.snackBar.open('Cliente creado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/clientes']);
      });
    }
  }

  cancelar(): void {
    if (this.form.dirty) {
      const confirmacion = confirm('¿Desea salir sin guardar los cambios?');
      if (!confirmacion) return;
    } 
    this.router.navigate(['/clientes']);
  }
    
}
