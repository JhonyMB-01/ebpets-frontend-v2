import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Proveedor } from '../../core/models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private http = inject(HttpClient);

  private API_URL = 'http://localhost:8080/api/v1/proveedor';

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.API_URL);
  }

  getProveedorById(id: number) {
    return this.http.get<Proveedor>(`${this.API_URL}/${id}`);
  }

  createProveedor(data: any) {
    return this.http.post(this.API_URL, data);
  }

  updateProveedor(id: number, data: any) {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }


}