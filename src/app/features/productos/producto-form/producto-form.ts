import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MaterialModule } from '../../../shared/material/material.module';
import { ProductoService } from '../producto.service';
import { Producto, Categoria, Marca } from '../../../core/models/producto.model';
import { MarcaService } from '../../marcas/marca.service';
import { CategoriaService } from '../../categorias/categoria.service';


@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.scss']
})
export class ProductoFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);

  private marcaService = inject(MarcaService);
  private categoriaService = inject(CategoriaService);


  modoEdicion = false;
  productoId!: number;

  categorias: Categoria[] = [];
  marcas: Marca[] = [];

  form = this.fb.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
    categoriaId: [null as number | null, Validators.required],
    marcaId: [null as number | null, Validators.required],
    precioVenta: [0, [Validators.required, Validators.min(0)]],
    afectaIgv: [true],
    activo: [true]
  });

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.modoEdicion = true;
      this.productoId = +id;
      //this.cargarProducto();
    }

    this.cargarCatalogos();

  }

  cargarCatalogos(): void {

    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => {
        // ✅ forzar nueva referencia (CRÍTICO)
        this.categorias = [...categorias];
      },
      error: (err) => console.error('Error cargando categorías', err)
    });

    this.marcaService.getMarcas().subscribe({
      next: (marcas) => {
        // ✅ forzar nueva referencia
        this.marcas = [...marcas];

        // ✅ SOLO AQUÍ cargar producto
        if (this.modoEdicion) {
          this.cargarProducto();
        }

      },
      error: (err) => console.error('Error cargando marcas', err)
    });

  }

  cargarProducto(): void {
    console.log('Cargando producto con ID:', this.productoId);
    this.productoService.getProductoById(this.productoId)
      .subscribe({
        next: (producto: Producto) => {

          this.form.patchValue({
            codigo: producto.codigo,
            nombre: producto.nombre,
            categoriaId: producto.categoria?.id ?? null,
            marcaId: producto.marca?.id ?? null,
            precioVenta: producto.precioVenta,
            afectaIgv: producto.afectaIgv,
            activo: producto.activo
          });

        },
        error: (err) => console.error(err)
      });

  }

  guardar(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = {
      codigo: this.form.value.codigo,
      nombre: this.form.value.nombre,
      precioVenta: this.form.value.precioVenta,
      afectaIgv: this.form.value.afectaIgv,
      activo: this.form.value.activo,
      idMarca: this.form.value.marcaId,
      idCategoria: this.form.value.categoriaId
    };

    if (this.modoEdicion) {

      this.productoService.updateProducto(this.productoId, dto)
        .subscribe(() => this.router.navigate(['/productos']));

    } else {

      this.productoService.createProducto(dto)
        .subscribe(() => this.router.navigate(['/productos']));
    }

  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }
}