import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs';

import { LoginRequest, LoginResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  constructor(
     private  http : HttpClient,
  ) { 
    console.log('AuthService initialized');
  }

  private readonly API_URL = 'http://localhost:8080/api/auth';

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private get storageAvailable(): boolean {
    return this.isBrowser && typeof localStorage !== 'undefined';
  }

  login(data: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/login`, data)
      .pipe(
        tap((response) => this.setSession(response))
      );
  }

  private setSession(auth: LoginResponse): void {
  
    localStorage.setItem('token', auth.token);
    localStorage.setItem('username', auth.username);
    localStorage.setItem('rol', auth.rol);
  }

  logout(): void {
     if (!this.storageAvailable) {
      return;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('rol');
  }

  getToken(): string | null {
       if (!this.storageAvailable) {
      return null;
    }

    return localStorage.getItem('token');
  }

  getRol(): string | null {
  
   if (!this.storageAvailable) {
      return null;
    }
    return localStorage.getItem('rol');
  }

  getUsername(): string | null {
   if (!this.storageAvailable) {
      return null;
    }

    return localStorage.getItem('username');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}