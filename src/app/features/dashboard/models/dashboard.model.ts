export interface DashboardResponse {

  kpis: DashboardKpis;

  productosSinStock: ProductoSinStock[];

  ultimasVentas: UltimaVenta[];

}


export interface DashboardKpis {

  ventasHoy: number;

  ventasMes: number;

  comprasMes: number;

  clientes: number;

  productos: number;

  stockBajo: number;

  sinStock: number;

  ventasHoyCantidad: number;

  ticketPromedio: number;

  productosPorVencer: number;

}


export interface ProductoSinStock {

  idProducto: number;

  codigo: string;

  producto: string;

  stock: number;

  stockMinimo: number;

}


export interface UltimaVenta {

  idVenta: number;

  cliente: string;

  total: number;

  fecha: string;

}