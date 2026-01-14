import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// 1. Importaciones clave
// CommonModule es para *ngIf, *ngFor
// DatePipe y CurrencyPipe son para formatear la fecha y el total en el HTML
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';

// 2. Importar el servicio y el modelo
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../models/venta.model'; // <-- Usamos tu modelo

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

  /**
   * Genera y descarga la factura en PDF.
   * Crea un enlace temporal en el navegador para descargar el Blob recibido.
   */
  public generarFactura(ventaId: number | undefined): void {
    if (!ventaId) {
      alert('ID de venta no válido');
      return;
    }

    this.ventaService.descargarFacturaPDF(ventaId).subscribe({
      next: (blob: Blob) => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `factura-${ventaId}.pdf`; // Nombre del archivo que se descargará
        link.click();

        // Limpiar memoria
        window.URL.revokeObjectURL(url);
      },
      error: (err : any) => {
        console.error('Error al generar factura:', err);
        alert('Error al generar la factura. Verifica que la venta exista.');
      }
    });
  }

  /**
   * Anula una venta y devuelve los productos al stock.
   * Cambia el estado de la venta a CANCELADA.
   */
  public anularVenta(ventaId: number | undefined): void {
    if (!ventaId) {
      alert('ID de venta no válido');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas anular esta venta? Los productos serán devueltos al stock.')) {
      return;
    }

    this.ventaService.anularVenta(ventaId).subscribe({
      next: (ventaAnulada: Venta) => {
        alert('Venta anulada exitosamente. Los productos han sido devueltos al stock.');
        this.cargarVentas();
      },
      error: (err: any) => {
        console.error('Error al anular la venta:', err);
        alert('Error al anular la venta. Verifique que la venta exista.');
      }
    });
  }
}
