export interface DetalleCompra {
  producto: string;
  cantidad: number;
  precioCompra: number;
  lote?: string;
  fechaVencimiento?: string;
}

export interface Compra {
  id: number;
  proveedor: string;
  fecha: string;
  total: number;
}

export interface CompraDetalle extends Compra {
  items: DetalleCompra[];
}
