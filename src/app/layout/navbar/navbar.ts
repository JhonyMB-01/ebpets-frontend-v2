import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


import { MaterialModule } from '../../shared/material/material.module';
import { AuthService } from '../../core/auth/auth.service';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  username = this.getUsername();
  role = this.authService.getRol();

  private getUsername(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('username');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
