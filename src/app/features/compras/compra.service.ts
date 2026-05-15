import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Compra, CompraDetalle } from '../../core/models/compra.model';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/compras';

  getCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.API_URL);
  }

  getCompraById(id: number): Observable<CompraDetalle> {
    return this.http.get<CompraDetalle>(`${this.API_URL}/${id}`);
  }

  crearCompra(data: any) {
    console.log('Enviando datos al backend:', data);
    return this.http.post(this.API_URL, data);
  }

}