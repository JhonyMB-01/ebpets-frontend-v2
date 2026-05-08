import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';


import { MaterialModule } from '../../shared/material/material.module';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MaterialModule, Navbar, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
