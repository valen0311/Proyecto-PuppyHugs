import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// 1. Importaciones clave
// CommonModule es para *ngIf, *ngFor
// DatePipe y CurrencyPipe son para formatear la fecha y el total en el HTML
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';

// 2. Importar el servicio y el modelo
import { VentaService } from '../../../services/venta.service';
import { Venta } from '../../../models/venta.model'; // <-- Usamos tu modelo

@Component({
  selector: 'app-ventas-admin',
  standalone: true,
  // 3. Declarar imports
  imports: [
    CommonModule,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './ventas-admin.component.html',
  styleUrl: './ventas-admin.component.css'
})
export class VentasAdminComponent implements OnInit {

  // 4. Inyección de dependencias
  private ventaService = inject(VentaService);

  // 5. Propiedades
  public ventas: Venta[] = [];
  public errorMessage: string | null = null;

  // No hay formulario en este componente, solo se muestra la lista

  ngOnInit(): void {
    // 6. Cargar la lista de ventas al iniciar
    this.cargarVentas();
  }

  /**
   * Obtiene todas las ventas del servicio
   */
  public cargarVentas(): void {
    this.errorMessage = null;

    // Se usa el método 'getVentas' de tu VentaService
    this.ventaService.getVentas().subscribe({
      next: (data: Venta[]) => {
        this.ventas = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.errorMessage = 'Error al cargar las ventas. Verifique la conexión con el backend.';
      }
    });
  }
}
