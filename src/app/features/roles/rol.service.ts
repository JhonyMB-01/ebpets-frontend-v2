import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Rol } from '../../core/models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/roles';

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.API_URL);
  }

  createRole(data: Rol) {
    return this.http.post(this.API_URL, data);
  }

  deleteRole(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }


}