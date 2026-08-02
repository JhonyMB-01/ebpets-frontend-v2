import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menu: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      roles: ['Administrador', 'Vendedor']
    },
    {
      label: 'Ventas',
      icon: 'point_of_sale',
      route: '/ventas',
      roles: ['Administrador', 'Vendedor']
    },
    {
      label: 'Clientes',
      icon: 'people',
      route: '/clientes',
      roles: ['Administrador', 'Vendedor']
    },
    {
      label: 'Productos',
      icon: 'inventory_2',
      route: '/productos',
      roles: ['Administrador']
    },
    {
      label: 'Compras',
      icon: 'shopping_cart',
      route: '/compras',
      roles: ['Administrador']
    },
    {
      label: 'Reportes',
      icon: 'bar_chart',
      route: '/reportes',
      roles: ['Administrador', 'Vendedor']
    },
    {
      label: 'Usuarios',
      icon: 'admin_panel_settings',
      route: '/usuarios',
      roles: ['Administrador']
    },
    {
      label: 'Categorías',
      icon: 'category',
      route: '/categorias',
      roles: ['Administrador']
    },
    {
      label: 'Marcas',
      icon: 'markunread_mailbox',
      route: '/marcas',
      roles: ['Administrador']
    },
    {
      label: 'Proveedores',
      icon: 'people',
      route: '/proveedores',
      roles: ['Administrador']
    },
    {
      label: 'Roles',
      icon: 'security',
      route: '/roles',
      roles: ['Administrador']
    }
    
  ];

  getMenuByRole(role: string): MenuItem[] {
    return this.menu.filter(item => item.roles.includes(role as any));
  }
}