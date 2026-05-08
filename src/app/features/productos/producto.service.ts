import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Producto } from '../../core/models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);

  private API_URL = 'http://localhost:8080/api/v1/producto';

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URL);
  }

  getProductoById(id: number) {
    return this.http.get<Producto>(`${this.API_URL}/${id}`);
  }

  createProducto(data: any) {
    return this.http.post(this.API_URL, data);
  }

  updateProducto(id: number, data: any) {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }


}
