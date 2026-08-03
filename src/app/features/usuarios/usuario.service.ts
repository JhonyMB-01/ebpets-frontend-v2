import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Usuario } from '../../core/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/usuarios';

  getUsuarios() {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  getUsuarioById(id: number) {
    return this.http.get<Usuario>(`${this.API_URL}/${id}`);
  }

  updateUsuario(id: number, Usuario: any) {
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, Usuario);
  }

  createUsuario(Usuario: any) {
    return this.http.post<Usuario>(this.API_URL, Usuario);
  }

}