export interface Venta {
  
  producto: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  total: number;
  lote: string;
  fechaVencimiento: string; // ✅ string ISO date


}

export interface VentaDetalle {
  
  id: number;
  cliente: string;
  vendedor: string;
  subtotal: number;
  igv: number;
  total: number;
  estado: 'PENDIENTE' | 'PAGADO' | 'CANCELADO';
  fecha: string; // ✅ datetime

  items: Venta[];

  
  
}
