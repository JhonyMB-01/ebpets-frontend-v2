import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
     {
        path: 'login',
        loadComponent: () =>
        import('./features/login/login')
            .then(m => m.LoginComponent)
    },
    {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard')
            .then(m => m.Dashboard),
        data: { roles: ['Administrador', 'Vendedor'] },
        canActivate: [roleGuard]
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/productos/productos-list/productos-list')
            .then(m => m.ProductosListComponent),
        data: { roles: ['Administrador'] },
        canActivate: [roleGuard]
      },
      {
        path: 'productos/nuevo',
        loadComponent: () =>
          import('./features/productos/producto-form/producto-form')
            .then(m => m.ProductoFormComponent)
      },
      {
        path: 'productos/:id',
        loadComponent: () =>
          import('./features/productos/producto-form/producto-form')
            .then(m => m.ProductoFormComponent)
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/categorias/categoria-list/categoria-list')
            .then(m => m.CategoriaListComponent)
      },
      {
        path: 'categorias/nuevo',
        loadComponent: () =>
          import('./features/categorias/categoria-form/categoria-form')
            .then(m => m.CategoriaFormComponent)
      },
      {
        path: 'categorias/:id',
        loadComponent: () =>
          import('./features/categorias/categoria-form/categoria-form')
            .then(m => m.CategoriaFormComponent)
      },
      {
        path: 'marcas',
        loadComponent: () =>
          import('./features/marcas/marca-list/marca-list.component')
            .then(m => m.MarcaListComponent)
      },
      {
        path: 'marcas/nuevo',
        loadComponent: () =>
          import('./features/marcas/marca-form/marca-form.component')
            .then(m => m.MarcaFormComponent)
      },
      {
        path: 'marcas/:id',
        loadComponent: () =>
          import('./features/marcas/marca-form/marca-form.component')
            .then(m => m.MarcaFormComponent)
      },
      {
        path: 'proveedores',
        loadComponent: () =>
          import('./features/proveedores/proveedor-list/proveedor-list.component')
            .then(m => m.ProveedorListComponent)
      },
      {
        path: 'proveedores/nuevo',
        loadComponent: () =>
          import('./features/proveedores/proveedor-form/proveedor-form.component')
            .then(m => m.ProveedorFormComponent)
      },
      {
        path: 'proveedores/:id',
        loadComponent: () =>
          import('./features/proveedores/proveedor-form/proveedor-form.component')
            .then(m => m.ProveedorFormComponent)
      },
      {
        path: 'compras',
        loadComponent: () =>
          import('./features/compras/compra-list/compra-list.component')
            .then(m => m.CompraListComponent)
      },
      {
        path: 'compras/nuevo',
        loadComponent: () =>
          import('./features/compras/compra-form/compra-form.component')
            .then(m => m.CompraFormComponent)
      },
      {
        path: 'ventas',
        loadComponent: () =>
          import('./features/ventas/venta-list/venta-list.component')
            .then(m => m.VentaListComponent)
      },
      {path: 'ventas/nuevo',
        loadComponent: () =>
          import('./features/ventas/venta-form/venta-form.component')
            .then(m => m.VentaFormComponent)
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/clientes/cliente-list/cliente-list.component')
            .then(m => m.ClienteListComponent)
      },
      {
        path: 'clientes/nuevo',
        loadComponent: () =>
          import('./features/clientes/cliente-form/cliente-form.component')
            .then(m => m.ClienteFormComponent)
      },
      {
        path: 'clientes/:id',
        loadComponent: () =>
          import('./features/clientes/cliente-form/cliente-form.component')
            .then(m => m.ClienteFormComponent)
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./features/roles/rol-list/rol-list.component')
            .then(m => m.RolListComponent)
      },
      {
        path: 'roles/nuevo',
        loadComponent: () =>
          import('./features/roles/rol-form/rol-form.component')
            .then(m => m.RolFormComponent)
      },
      {
        path: 'roles/:id',
        loadComponent: () =>
          import('./features/roles/rol-form/rol-form.component')
            .then(m => m.RolFormComponent)
      }

    ]
    }
];
