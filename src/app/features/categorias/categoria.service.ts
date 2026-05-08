import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Categoria } from '../../core/models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/v1/categoria';

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API_URL);
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.API_URL}/${id}`);
  }

  createCategoria(data: Categoria) {
    return this.http.post(this.API_URL, data);
  }

  updateCategoria(id: number, data: Categoria) {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  deleteCategoria(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

}