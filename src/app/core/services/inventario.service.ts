import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Inventario } from '../../core/models/inventario.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/inventarios';

  getInventarios(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.API_URL);
  }

}