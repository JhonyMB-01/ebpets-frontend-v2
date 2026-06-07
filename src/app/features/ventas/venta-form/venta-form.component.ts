import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MaterialModule } from '../../../shared/material/material.module';

interface Cliente {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  precioVenta: number;
}

interface Inventario {
  id: number;
  lote: string;
  stock: number;
  fechaVencimiento: string;
}

interface VentaItem {
  idProducto: number;
  idInventario: number;
  producto: string;
  lote: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  total: number;
}

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './venta-form.component.html',
  styleUrls: ['./venta-form.component.css'] 
})
export class VentaFormComponent {

  private fb = inject(FormBuilder);

  clientes: Cliente[] = [
    { id: 1, nombre: 'Cliente General' },
    { id: 2, nombre: 'Maria Lopez' }
  ];

  productos: Producto[] = [
    { id: 1, nombre: 'Alimento perro 10kg', precioVenta: 120 },
    { id: 2, nombre: 'Medicamento mascota', precioVenta: 50 }
  ];

  inventariosPorProducto: Record<number, Inventario[]> = {
    1: [
      {
        id: 10,
        lote: 'L001',
        stock: 50,
        fechaVencimiento: '2026-07-10'
      },
      {
        id: 11,
        lote: 'L002',
        stock: 30,
        fechaVencimiento: '2027-01-01'
      }
    ],
    2: [
      {
        id: 20,
        lote: 'Farmacos',
        stock: 10,
        fechaVencimiento: '2027-06-20'
      }
    ]
  };

  inventarios: Inventario[] = [];

  filteredProductos: Producto[] = [];

  productoSeleccionado: Producto | null = null;

  items: VentaItem[] = [];

  stockDisponible = 0;
  stockValido = true;

  subtotal = 0;
  igv = 0;
  total = 0;

  form = this.fb.group({
    idCliente: [1, Validators.required],

    metodoPago: ['EFECTIVO'],

    estadoVenta: ['PAGADO'],

    idProducto: [null as number | null],

    idInventario: [null as number | null],

    cantidad: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    precioUnitario: [
      0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],

    descuento: [
      0,
      [
        Validators.min(0)
      ]
    ]
  });

  buscarProducto(event: Event): void {

    const value =
      (event.target as HTMLInputElement)
        .value
        .toLowerCase();

    this.filteredProductos =
      this.productos.filter(p =>
        p.nombre.toLowerCase().includes(value)
      );
  }

  seleccionarProducto(producto: Producto): void {

    this.productoSeleccionado = producto;

    this.form.patchValue({
      idProducto: producto.id,
      precioUnitario: producto.precioVenta
    });

    this.inventarios =
      this.inventariosPorProducto[producto.id] || [];

    const primerLote =
      this.inventarios[0];

    this.form.patchValue({
      idInventario: primerLote?.id ?? null
    });

    this.filteredProductos = [];

    this.actualizarStock();
  }

  seleccionarInventario(): void {
    this.actualizarStock();
  }

  actualizarStock(): void {

    const idInventario =
      this.form.value.idInventario;

    const inventario =
      this.inventarios.find(
        i => i.id === idInventario
      );

    this.stockDisponible =
      inventario?.stock ?? 0;

    this.validarStock();
  }

  validarStock(): void {

    const cantidad =
      this.form.value.cantidad ?? 0;

    this.stockValido =
      cantidad <= this.stockDisponible;
  }

  get totalItem(): number {

    const f = this.form.getRawValue();

    return (
      (f.cantidad ?? 0) *
      (f.precioUnitario ?? 0)
    ) - (f.descuento ?? 0);
  }

  agregarItem(): void {

    if (!this.stockValido) return;

    const f = this.form.getRawValue();

    if (!f.idProducto || !f.idInventario) {
      return;
    }

    const producto =
      this.productos.find(
        p => p.id === f.idProducto
      );

    const inventario =
      this.inventarios.find(
        i => i.id === f.idInventario
      );

    const total =
      ((f.cantidad ?? 0) *
      (f.precioUnitario ?? 0))
      - (f.descuento ?? 0);

    const item: VentaItem = {
      idProducto: f.idProducto,
      idInventario: f.idInventario,
      producto: producto?.nombre ?? '',
      lote: inventario?.lote ?? '',
      cantidad: f.cantidad ?? 0,
      precioUnitario: f.precioUnitario ?? 0,
      descuento: f.descuento ?? 0,
      total
    };

    this.items = [...this.items, item];

    if (inventario) {
      inventario.stock -= item.cantidad;
    }

    this.actualizarStock();

    this.recalcularTotales();

    this.form.patchValue({
      cantidad: 1,
      descuento: 0
    });
  }

  eliminarItem(index: number): void {

    this.items =
      this.items.filter(
        (_, i) => i !== index
      );

    this.recalcularTotales();
  }

  recalcularTotales(): void {

    this.subtotal =
      this.items.reduce(
        (acc, item) => acc + item.total,
        0
      );

    this.igv =
      this.subtotal * 0.18;

    this.total =
      this.subtotal + this.igv;
  }

  // ======================
  // GUARDAR VENTA
  // ======================

  guardarVenta(): void {

    if (this.items.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    const f = this.form.getRawValue();

    const venta = {
      idCliente: f.idCliente,
      metodoPago: f.metodoPago,
      estadoVenta: f.estadoVenta,
      subtotal: this.subtotal,
      igv: this.igv,
      total: this.total,
      items: this.items
    };

    console.log('VENTA FINAL:', venta);

    alert('Venta registrada correctamente');

    this.form.reset();
    this.items = [];
    this.subtotal = 0;
    this.igv = 0;
    this.total = 0;
    this.productoSeleccionado = null;
    this.stockValido = true;
    this.inventarios = [];
    this.filteredProductos = [];
  }
}


