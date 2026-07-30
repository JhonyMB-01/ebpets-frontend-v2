import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { MaterialModule } from '../../../shared/material/material.module';
import { Producto } from '../../../core/models/producto.model';
import { ProductoService } from '../../productos/producto.service';
import { ClienteService } from '../../clientes/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';
import { InventarioService } from '../../../core/services/inventario.service';
import { Inventario } from '../../../core/models/inventario.model';
import { VentaService } from '../venta.service';


/*interface Inventario {
  id: number;
  lote: string;
  stock: number;
  fechaVencimiento: string;
}*/ 

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
  private productoService = inject(ProductoService);
  private clienteService = inject(ClienteService);
  private inventarioService = inject(InventarioService);
  private ventaService = inject(VentaService);
  private router = inject(Router);

  productos: Producto[] = [];

  clientes: Cliente[] = [];

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

   ngOnInit(): void {
    console.log('Cargando productos, clientes...');
    this.cargarProductos();
    this.cargarClientes();
  }

   cargarProductos(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = [...data];
      console.log('Productos cargados:', this.productos);
    });
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe(data => {
      this.clientes = [...data];
      console.log('clientes cargados:', this.clientes);
    });
  }

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

     // Cargar inventarios desde el endpoint

    /*this.inventarios =
      this.inventariosPorProducto[producto.id] || [];

    const primerLote =
      this.inventarios[0];

    this.form.patchValue({
      idInventario: primerLote?.id ?? null
    });

    this.filteredProductos = [];

    this.actualizarStock();*/

    this.inventarioService.getInventarioByIdProducto(producto.id)
            .subscribe({
                next: (data) => {
                    this.inventarios = data.map(d => ({
                        id: d.id,
                        lote: d.lote ?? '',
                        stock: d.stock,
                        fechaVencimiento: d.fechaVencimiento ?? '',
                        nombreProducto: d.nombreProducto ?? '',
                        stockMinimo: d.stockMinimo
                    }));

                    const primerLote = this.inventarios[0];
                    this.form.patchValue({
                        idInventario: primerLote?.id ?? null
                    });
                    this.filteredProductos = [];
                    this.actualizarStock();
                },
                error: (err) => {
                    console.error('Error cargando inventarios:', err);
                    this.inventarios = [];
                }
            });

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

    this.ventaService.saveVenta(venta)
        .subscribe(() => this.router.navigate(['/ventas']));

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


