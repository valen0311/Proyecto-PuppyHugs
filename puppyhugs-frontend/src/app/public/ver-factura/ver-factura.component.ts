// src/app/public/ver-factura/ver-factura.component.ts

import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { VentaService } from '../../services/venta.service';
import { Venta } from '../../models/venta.model';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-ver-factura',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './ver-factura.component.html',
  styleUrl: './ver-factura.component.css'
})
export class VerFacturaComponent implements OnInit {

  private ventaService = inject(VentaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  public venta: Venta | null = null;
  public cliente: Cliente | null = null;
  public errorMessage: string | null = null;
  public isLoading: boolean = true;
  public isDownloading: boolean = false;

  ngOnInit(): void {
    // Obtener cliente del localStorage
    if (isPlatformBrowser(this.platformId)) {
      const userStorage = localStorage.getItem('usuarioLogueado');
      if (userStorage) {
        this.cliente = JSON.parse(userStorage);
      }
    }

    // Obtener parámetros de la ruta
    this.route.queryParams.subscribe(params => {
      const ventaId = params['ventaId'];
      if (ventaId) {
        this.cargarVenta(Number(ventaId));
      } else {
        this.errorMessage = 'No se proporcionó un ID de venta válido.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Carga los datos de la venta
   */
  private cargarVenta(ventaId: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Nota: En producción, podrías necesitar un endpoint GET /api/ventas/{id}
    // Por ahora, usamos el método getVentas y filtramos
    this.ventaService.getVentas().subscribe({
      next: (ventas: Venta[]) => {
        const ventaEncontrada = ventas.find(v => v.id === ventaId);
        if (ventaEncontrada) {
          this.venta = ventaEncontrada;
        } else {
          this.errorMessage = 'No se encontró la venta especificada.';
        }
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar la venta:', err);
        this.errorMessage = 'Error al cargar la información de la venta.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Descarga la factura en PDF
   */
  public descargarFactura(): void {
    if (!this.venta || !this.venta.id) {
      this.errorMessage = 'No hay una venta válida para descargar.';
      return;
    }

    this.isDownloading = true;
    this.errorMessage = null;

    this.ventaService.descargarFacturaPDF(this.venta.id).subscribe({
      next: (blob: Blob) => {
        // Crear un enlace temporal para descargar el archivo
        if (isPlatformBrowser(this.platformId)) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `factura-${this.venta!.id}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Limpiar memoria
          window.URL.revokeObjectURL(url);
        }
        this.isDownloading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al descargar la factura:', err);
        this.errorMessage = 'Error al descargar la factura. Verifica que la venta exista.';
        this.isDownloading = false;
      }
    });
  }

  /**
   * Regresa a la vista de pago
   */
  public volver(): void {
    this.router.navigate(['/cliente/pago']);
  }

  /**
   * Formatea la fecha para mostrar
   */
  public formatearFecha(fecha: string): string {
    if (!fecha) return '';
    try {
      const date = new Date(fecha);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fecha;
    }
  }

  /**
   * Obtiene las claves del objeto productos (para iterar)
   */
  public getProductosKeys(): number[] {
    if (!this.venta || !this.venta.productos) {
      return [];
    }
    return Object.keys(this.venta.productos).map(k => Number(k));
  }
}
