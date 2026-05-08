
export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: Array<'Administrador' | 'Vendedor'>;
}
