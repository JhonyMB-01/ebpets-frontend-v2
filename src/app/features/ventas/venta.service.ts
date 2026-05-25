import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Venta } from '../../core/models/venta.model';
import { VentaDetalle } from '../../core/models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/ventas';

  getVentas() {
    return this.http.get<Venta[]>(this.API_URL);
  }

  
getVentaById(id: number) {
  return this.http.get<VentaDetalle>(`${this.API_URL}/${id}`);
}


}
