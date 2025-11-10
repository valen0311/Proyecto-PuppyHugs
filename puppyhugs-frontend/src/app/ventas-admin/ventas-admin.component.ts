// Archivo: src/app/ventas-admin/ventas-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { VentaService } from '../services/venta.service'; // Importamos el servicio
import { Venta } from '../model/venta.interface'; // Importamos el modelo

@Component({
  selector: 'app-ventas-admin',
  templateUrl: './ventas-admin.component.html',
  // Reusamos el CSS de productos para mantener la consistencia
  styleUrls: ['../productos-admin/productos-admin.component.css']
})
export class VentasAdminComponent implements OnInit {

  // Arreglo para guardar las ventas de la API
  ventas: Venta[] = [];
  isLoading: boolean = true;

  constructor(
    private ventaService: VentaService
  ) { }

  ngOnInit(): void {
    // 1. Cuando el componente carga, llama a la función de cargar
    this.cargarVentas();
  }

  /**
   * 2. Llama al servicio para obtener todas las ventas
   */
  cargarVentas(): void {
    this.isLoading = true;
    this.ventaService.getVentas().subscribe({
      next: (data) => {
        this.ventas = data;
        this.isLoading = false;
        console.log('Ventas cargadas:', data);
      },
      error: (err) => {
        console.error('Error cargando ventas:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * 3. (Helper) Muestra los productos de una venta
   * (Usado en el HTML para el 'tooltip')
   */
  getDetalleTooltip(venta: Venta): string {
    return venta.detalles
      .map(d => `${d.cantidad} x ${d.producto.nombre}`)
      .join('\n'); // Crea un string con saltos de línea
  }
}
