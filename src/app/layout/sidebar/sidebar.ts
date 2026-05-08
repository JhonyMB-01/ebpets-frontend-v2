import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../shared/material/material.module';
import { MenuService } from '../../core/services/menu.service';
import { AuthService } from '../../core/auth/auth.service';
import { MenuItem } from '../../core/models/menu.model';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  
  private menuService = inject(MenuService);
  private authService = inject(AuthService);

  menuItems: MenuItem[] = [];
  
  ngOnInit(): void {
      const role = this.authService.getRol();
      if (role) {
        this.menuItems = this.menuService.getMenuByRole(role);
      }
    }

}
