// src/app/components/admin/dashboard-admin/dashboard-admin.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {

  // En el futuro, aquí podrías inyectar servicios
  // (VentaService, ClienteService) para obtener
  // estadísticas y mostrarlas en el dashboard.

  public totalVentas: number = 0;
  public totalClientes: number = 0;
  public totalProductos: number = 0;

  constructor() {
    // Simulación de datos (luego vendrán de los services)
    this.totalVentas = 1250.50;
    this.totalClientes = 42;
    this.totalProductos = 89;
  }

}
