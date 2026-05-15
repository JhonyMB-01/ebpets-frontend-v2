import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { MaterialModule } from '../../../shared/material/material.module';

import { Proveedor } from '../../../core/models/proveedor.model';
import { Producto } from '../../../core/models/producto.model';
import { CompraService } from '../compra.service';
import { ProveedorService } from '../../proveedores/proveedor.service';
import { ProductoService } from '../../productos/producto.service';

@Component({
  selector: 'app-compra-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './compra-form.component.html',
  styleUrls: ['./compra-form.component.css']
})
export class CompraFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private compraService = inject(CompraService);
  private proveedorService = inject(ProveedorService);
  private productoService = inject(ProductoService);

  proveedores: Proveedor[] = [];
  productos: Producto[] = [];

  compraForm = this.fb.group({
    proveedorId: [null, Validators.required],
    items: this.fb.array([])
  });

  get itemsFormArray(): FormArray {
    return this.compraForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarProductos();
  }

  cargarProveedores(): void {
    this.proveedorService.getProveedores().subscribe(data => {
      this.proveedores = [...data];
    });
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = [...data];
    });
  }

  agregarItem(): void {
    const itemGroup = this.fb.group({
      idProducto: [null, Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      precioCompra: [null, [Validators.required, Validators.min(0.01)]],
      lote: [null, Validators.required],
      fechaVencimiento: [null, Validators.required]
    });

    this.itemsFormArray.push(itemGroup);
  }

  eliminarItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }

  guardar(): void {
    if (this.compraForm.invalid || this.itemsFormArray.length === 0) {
      return;
    }

    const dto = {
      idProveedor: this.compraForm.value.proveedorId,
      items: this.itemsFormArray.value
    };

    console.log('DTO a enviar:', dto);
    this.compraService.crearCompra(dto).subscribe(() => {
      this.router.navigate(['/compras']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/compras']);
  }
}
