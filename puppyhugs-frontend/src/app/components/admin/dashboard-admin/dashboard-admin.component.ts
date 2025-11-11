// src/app/components/admin/dashboard-admin/dashboard-admin.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// ¡¡IMPORTANTE!! Añadir los módulos del Router
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,

  // 1. AÑADIR ESTO a los imports:
  imports: [
    CommonModule,
    RouterOutlet,     // Para <router-outlet>
    RouterLink,         // Para [routerLink]
    RouterLinkActive    // Para [routerLinkActive]
  ],

  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {

  // Tus propiedades de estadísticas están perfectas
  public totalVentas: number = 0;
  public totalClientes: number = 0;
  public totalProductos: number = 0;

  constructor() {
    // Simulación de datos (luego vendrán de los services)
    this.totalVentas = 1250.50;
    this.totalClientes = 42;
    this.totalProductos = 89;

    // NOTA: Si estas estadísticas SÓLO deben verse en una
    // página de "Resumen", entonces este componente NO es el layout.
    // Pero si quieres que estas tarjetas siempre estén visibles
    // *encima* de la tabla de usuarios, etc., entonces este SÍ es el layout.
    //
    // Asumiré que quieres un layout limpio (Sidebar + Contenido).
  }
}
