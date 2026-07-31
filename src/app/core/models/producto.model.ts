export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  precioVenta: number;
  afectaIgv: boolean;
  activo: boolean;
  marca: Marca;
  categoria: Categoria;
  tieneInventario: boolean;
  
}


export interface Marca {
  id: number;
  nombre: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}
