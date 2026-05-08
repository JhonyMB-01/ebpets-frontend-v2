import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { DashboardMetric } from '../../models/dashboard.model';


@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.scss',
})
export class MetricCard {
  @Input() metric!: DashboardMetric;
}
