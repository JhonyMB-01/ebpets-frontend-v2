import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService} from './dashboard.service';
import { DashboardResponse } from './models/dashboard.model';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  private readonly dashboardService = inject(DashboardService);

  dashboard: DashboardResponse | null = null;

  loading = false;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {

    this.loading = true;

    this.dashboardService.getDashboard().subscribe({
      next: (response: DashboardResponse) => {
        this.dashboard = response;
        this.loading = false;
      },
      error: error => {
        console.error('Error cargando dashboard', error);
        this.loading = false;
      }
    });

  }

  formatMoney(value: number): string {
    return value.toLocaleString('es-PE', {
      style: 'currency',
      currency: 'PEN'
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('es-PE');
  }

}


/*
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {


  private dashboardService = inject(DashboardService);


  dashboard?: DashboardResponse;


  ngOnInit(): void {

    this.cargar();

  }



  cargar(): void {

    this.dashboardService.getDashboard()
      .subscribe({

        next: (data: DashboardResponse) => {

          this.dashboard = data;

          console.log(
            'Dashboard data:',
            this.dashboard
          );

        },


        error: (err) => {

          console.error(
            'Error cargando dashboard',
            err
          );

        }

      });

  }



  formatDate(date: string): string {

    return new Date(date)
      .toLocaleString('es-PE');

  }



  formatMoney(value: number): string {

    return value.toLocaleString(
      'es-PE',
      {
        style: 'currency',
        currency: 'PEN'
      }
    );

  }

}*/



/*interface CardSummary {
  title: string;
  value: string | number;
  icon: string;
}

interface Sale {
  id: number;
  customer: string;
  amount: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  currentDate = new Date();

  userName = 'Usuario';

  summaryCards: CardSummary[] = [
    {
      title: 'Ventas Hoy',
      value: 'S/. 2,350',
      icon: '💰'
    },
    {
      title: 'Ventas Mes',
      value: 'S/. 45,320',
      icon: '📈'
    },
    {
      title: 'Compras',
      value: 'S/. 31,100',
      icon: '🛒'
    },
    {
      title: 'Utilidad',
      value: 'S/. 14,220',
      icon: '💵'
    }
  ];


  inventoryCards: CardSummary[] = [
    {
      title: 'Clientes',
      value: 325,
      icon: '👥'
    },
    {
      title: 'Productos',
      value: 180,
      icon: '📦'
    },
    {
      title: 'Stock Bajo',
      value: 8,
      icon: '⚠'
    },
    {
      title: 'Sin Stock',
      value: 3,
      icon: '❌'
    }
  ];


  alerts = [
    'Sin stock',
    'Stock crítico'
  ];


  expiringProducts = [
    'Vence en 5 días',
    'Vence en 10 días'
  ];


  lastSales: Sale[] = [
    {
      id: 1023,
      customer: 'Juan Pérez',
      amount: 'S/. 89.50',
      time: 'Hoy 10:35'
    },
    {
      id: 1022,
      customer: 'María Díaz',
      amount: 'S/. 55.00',
      time: 'Hoy 10:10'
    },
    {
      id: 1021,
      customer: 'Cliente General',
      amount: 'S/. 18.00',
      time: 'Hoy 09:45'
    }
  ];


  formatDate(): string {
    return this.currentDate.toLocaleDateString(
      'es-PE',
      {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

}*/