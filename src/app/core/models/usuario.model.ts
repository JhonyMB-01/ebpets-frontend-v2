import { Rol } from "./rol.model";

export interface Usuario {
  id: number;
  nombre: string;
  username: string;
  rol: Rol;
  activo: boolean;
  password?: string; // Optional property for password, only used when creating or updating a user
}


