
import { Component, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import {Subject, debounceTime, distinctUntilChanged, takeUntil} from 'rxjs';

import { MaterialModule } from '../../../shared/material/material.module';
import { ProductoService } from '../producto.service';
import { Producto } from '../../../core/models/producto.model';


@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatPaginatorModule
  ],
  templateUrl: './productos-list.html',
  styleUrls: ['./productos-list.scss']
})
export class ProductosListComponent
  implements OnInit, OnDestroy {


  // ============================================================
  // DEPENDENCIAS
  // ============================================================

  private productoService = inject(ProductoService);

  private router = inject(Router);


  // ============================================================
  // SUBJECTS
  // ============================================================

  /**
   * Controla el buscador.
   *
   * Se utiliza debounce de 300 ms para evitar
   * ejecutar el filtrado en cada tecla.
   */
  private searchSubject =
    new Subject<string>();


  /**
   * Permite cancelar las suscripciones
   * cuando el componente es destruido.
   */
  private destroy$ =
    new Subject<void>();


  // ============================================================
  // PAGINADOR
  // ============================================================

  private _paginator?: MatPaginator;


  /**
   * Setter utilizado para detectar el momento
   * exacto en que Angular crea el paginator.
   *
   * Esto es especialmente importante porque
   * el paginator está dentro de *ngIf="!loading".
   */
  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator | undefined) {

    if (!paginator) {
      return;
    }

    this._paginator = paginator;

    /*
     * Asociamos inmediatamente el paginator
     * al dataSource.
     */
    this.dataSource.paginator = paginator;

  }


  // ============================================================
  // TABLA
  // ============================================================

  displayedColumns: string[] = [

    'codigo',
    'nombre',
    'categoria',
    'marca',
    'precioVenta',
    'activo',
    'afectaIgv',
    'acciones'

  ];


  /**
   * DataSource de la tabla.
   *
   * El mismo objeto se mantiene durante
   * todo el ciclo de vida del componente.
   */
  dataSource =
    new MatTableDataSource<Producto>([]);


  // ============================================================
  // DATOS
  // ============================================================

  /**
   * Lista completa recibida desde el backend.
   *
   * Esta lista no se modifica cuando aplicamos
   * filtros o búsqueda.
   */
  productos: Producto[] = [];


  /**
   * Texto del buscador.
   */
  searchValue = '';


  /**
   * Filtro de estado.
   */
  estadoFiltro:
    | 'todos'
    | 'activos'
    | 'inactivos' = 'todos';


  /**
   * Categoría seleccionada.
   */
  categoriaFiltro = '';


  /**
   * Categorías disponibles.
   */
  categorias: string[] = [];


  /**
   * Estado de carga.
   */
  loading = true;


  // ============================================================
  // CICLO DE VIDA
  // ============================================================

  ngOnInit(): void {

    this.configurarBuscador();

    this.cargarProductos();

  }


  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

    this.searchSubject.complete();

  }


  // ============================================================
  // CARGAR PRODUCTOS
  // ============================================================

  cargarProductos(): void {

    this.loading = true;

    this.productoService.getProductos()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (data: Producto[]) => {

          /*
           * Guardamos la lista original.
           */
          this.productos = data;


          /*
           * Obtenemos las categorías.
           */
          this.obtenerCategorias();


          /*
           * Aplicamos los filtros iniciales.
           *
           * No creamos un nuevo MatTableDataSource.
           * Solamente actualizamos su data.
           */
          this.aplicarFiltros();


          /*
           * Primero quitamos el loading.
           *
           * Esto hace que Angular cree el mat-paginator
           * que está dentro del *ngIf="!loading".
           *
           * El setter de @ViewChild se encargará
           * automáticamente de asociarlo al dataSource.
           */
          this.loading = false;

        },

        error: (err) => {

          console.error(
            'Error al cargar productos',
            err
          );

          this.loading = false;

        }

      });

  }


  // ============================================================
  // BUSCADOR
  // ============================================================

  private configurarBuscador(): void {

    this.searchSubject
      .pipe(

        debounceTime(300),

        distinctUntilChanged(),

        takeUntil(this.destroy$)

      )
      .subscribe((search: string) => {

        this.searchValue = search;

        this.aplicarFiltros();

      });

  }


  buscarProducto(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchSubject.next(
      input.value
    );

  }


  limpiarBusqueda(): void {

    this.searchValue = '';

    /*
     * Actualizamos inmediatamente.
     *
     * No necesitamos esperar 300 ms
     * para limpiar los resultados.
     */
    this.aplicarFiltros();

  }


  // ============================================================
  // FILTRO DE ESTADO
  // ============================================================

  cambiarEstadoFiltro(
    filtro:
      | 'todos'
      | 'activos'
      | 'inactivos'
  ): void {

    this.estadoFiltro = filtro;

    this.aplicarFiltros();

  }


  // ============================================================
  // FILTRO DE CATEGORIA
  // ============================================================

  cambiarCategoriaFiltro(
    categoria: string
  ): void {

    this.categoriaFiltro = categoria;

    this.aplicarFiltros();

  }


  // ============================================================
  // OBTENER CATEGORIAS
  // ============================================================

  private obtenerCategorias(): void {

    const categorias =
      this.productos

        .map(
          producto =>
            producto.categoria?.nombre
        )

        .filter(
          (nombre): nombre is string =>
            !!nombre
        );


    this.categorias = [
      ...new Set(categorias)
    ].sort();

  }


  // ============================================================
  // APLICAR FILTROS
  // ============================================================

  private aplicarFiltros(): void {

    const search =
      this.searchValue
        .trim()
        .toLowerCase();


    const productosFiltrados =
      this.productos.filter(
        (producto: Producto) => {


          // ----------------------------------------------------
          // BUSQUEDA
          // ----------------------------------------------------

          const coincideBusqueda =
            !search ||

            producto.codigo
              ?.toLowerCase()
              .includes(search) ||

            producto.nombre
              ?.toLowerCase()
              .includes(search) ||

            producto.categoria?.nombre
              ?.toLowerCase()
              .includes(search) ||

            producto.marca?.nombre
              ?.toLowerCase()
              .includes(search);


          if (!coincideBusqueda) {

            return false;

          }


          // ----------------------------------------------------
          // ESTADO
          // ----------------------------------------------------

          if (
            this.estadoFiltro === 'activos' &&
            !producto.activo
          ) {

            return false;

          }


          if (
            this.estadoFiltro === 'inactivos' &&
            producto.activo
          ) {

            return false;

          }


          // ----------------------------------------------------
          // CATEGORIA
          // ----------------------------------------------------

          if (
            this.categoriaFiltro &&
            producto.categoria?.nombre !==
              this.categoriaFiltro
          ) {

            return false;

          }


          return true;

        }
      );


    /*
     * Actualizamos los datos del mismo dataSource.
     */
    this.dataSource.data =
      productosFiltrados;


    /*
     * Cuando aplicamos un filtro,
     * volvemos a la primera página.
     */
    if (this._paginator) {

      this._paginator.firstPage();

    }

  }


  // ============================================================
  // CONTADORES
  // ============================================================

  get totalProductos(): number {

    return this.productos.length;

  }


  get productosActivos(): number {

    return this.productos.filter(
      producto => producto.activo
    ).length;

  }


  get productosInactivos(): number {

    return this.productos.filter(
      producto => !producto.activo
    ).length;

  }


  /**
   * Cantidad de productos después
   * de aplicar filtros.
   */
  get productosFiltrados(): number {

    return this.dataSource.data.length;

  }


  /**
   * Indica si existe algún filtro activo.
   */
  get hayFiltrosActivos(): boolean {

    return !!(

      this.searchValue ||

      this.estadoFiltro !== 'todos' ||

      this.categoriaFiltro

    );

  }


  // ============================================================
  // LIMPIAR FILTROS
  // ============================================================

  limpiarFiltros(): void {

    this.searchValue = '';

    this.estadoFiltro = 'todos';

    this.categoriaFiltro = '';


    /*
     * Aplicamos inmediatamente los filtros.
     */
    this.aplicarFiltros();


    /*
     * Regresamos a la primera página.
     */
    if (this._paginator) {

      this._paginator.firstPage();

    }

  }


  // ============================================================
  // NAVEGACION
  // ============================================================

  nuevoProducto(): void {

    this.router.navigate([
      '/productos/nuevo'
    ]);

  }


  editarProducto(
    producto: Producto
  ): void {

    this.router.navigate([
      '/productos',
      producto.id
    ]);

  }

}

