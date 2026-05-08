import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Marca } from '../../core/models/marca.model';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/v1/marca';

  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.API_URL);
  }

  getMarcaById(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${this.API_URL}/${id}`);
  }

  createMarca(data: Marca) {
    return this.http.post(this.API_URL, data);
  }

  updateMarca(id: number, data: Marca) {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  deleteMarca(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

}