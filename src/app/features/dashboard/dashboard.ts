import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { MetricCard } from './components/metric-card/metric-card';
import { DashboardMetric } from './models/dashboard.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MetricCard
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  
metrics: DashboardMetric[] = [
    {
      label: 'Ventas hoy',
      value: 'S/ 1,250.00',
      icon: 'point_of_sale',
      type: 'primary'
    },
    {
      label: 'Ventas pendientes',
      value: '5',
      icon: 'schedule',
      type: 'warn'
    },
    {
      label: 'Stock crítico',
      value: '3 productos',
      icon: 'inventory_2',
      type: 'accent'
    }
  ];

}
