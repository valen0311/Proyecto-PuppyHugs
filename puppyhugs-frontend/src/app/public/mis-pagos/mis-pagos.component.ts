// src/app/public/mis-pagos/mis-pagos.component.ts

import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { PagoService } from '../../services/pago.service';
import { Pago } from '../../models/pago.model';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-mis-pagos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-pagos.component.html',
  styleUrl: './mis-pagos.component.css'
})
export class MisPagosComponent implements OnInit {

  private pagoService = inject(PagoService);
  private platformId = inject(PLATFORM_ID);

  public cliente: Cliente | null = null;
  public pagos: Pago[] = [];
  public pagosLoading: boolean = true;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public pagoAEliminar: number | null = null;
  public mostrarConfirmacion: boolean = false;

  ngOnInit(): void {
    // Obtener cliente del localStorage
    if (isPlatformBrowser(this.platformId)) {
      const userStorage = localStorage.getItem('usuarioLogueado');
      if (userStorage) {
        this.cliente = JSON.parse(userStorage);
      }
    }

    this.cargarPagos();
  }

  /**
   * Carga todos los pagos (filtrará por cliente si es necesario)
   */
  private cargarPagos(): void {
    this.pagosLoading = true;
    this.errorMessage = null;

    this.pagoService.obtenerTodosLosPagos().subscribe({
      next: (pagos: Pago[]) => {
        // TODO: Si tu backend tiene endpoint para filtrar por cliente, úsalo
        // Por ahora mostramos todos los pagos
        this.pagos = pagos.sort((a, b) => {
          // Ordenar por fecha, más recientes primero
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });
        this.pagosLoading = false;
        console.log('✅ Pagos cargados:', this.pagos);
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Error al cargar pagos:', err);
        this.pagosLoading = false;
        this.errorMessage = 'Error al cargar los pagos. Por favor intenta nuevamente.';
      }
    });
  }

  /**
   * Muestra la confirmación antes de eliminar
   */
  public confirmarEliminar(pagoId: number): void {
    this.pagoAEliminar = pagoId;
    this.mostrarConfirmacion = true;
  }

  /**
   * Cancela la eliminación
   */
  public cancelarEliminar(): void {
    this.pagoAEliminar = null;
    this.mostrarConfirmacion = false;
  }

  /**
   * Elimina un pago
   */
  public eliminarPago(): void {
    if (!this.pagoAEliminar) return;

    const pagoId = this.pagoAEliminar;
    this.errorMessage = null;
    this.successMessage = null;

    this.pagoService.eliminarPago(pagoId).subscribe({
      next: () => {
        console.log('✅ Pago eliminado:', pagoId);
        this.successMessage = 'Pago eliminado exitosamente';
        
        // Remover de la lista
        this.pagos = this.pagos.filter(p => p.id !== pagoId);
        
        // Cerrar modal
        this.mostrarConfirmacion = false;
        this.pagoAEliminar = null;

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Error al eliminar pago:', err);
        this.mostrarConfirmacion = false;
        this.pagoAEliminar = null;
        
        if (err.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor.';
        } else if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Error al eliminar el pago. Por favor intenta nuevamente.';
        }
      }
    });
  }

  /**
   * Formatea la fecha para mostrar
   */
  public formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtiene la clase CSS según el estado del pago
   */
  public getEstadoClass(estado: string): string {
    switch (estado) {
      case 'EXITOSO':
        return 'estado-exitoso';
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'FALLIDO':
        return 'estado-fallido';
      default:
        return '';
    }
  }
}