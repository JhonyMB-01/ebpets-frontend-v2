import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cliente } from '../../core/models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);

  private API_URL = 'http://localhost:8080/api/v1/cliente';

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API_URL);
  }

  getClienteById(id: number) {
    return this.http.get<Cliente>(`${this.API_URL}/${id}`);
  }

  createCliente(data: any) {
    return this.http.post(this.API_URL, data);
  }

  updateCliente(id: number, data: any) {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }


}