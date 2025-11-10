// src/app/models/pago.model.ts

/**
 * Define los estados de pago.
 * Coincide con el enum Pago.EstadoPago
 */
export type EstadoPago = 'EXITOSO' | 'FALLIDO' | 'PENDIENTE';

/**
 * Interfaz para el modelo Pago (la respuesta).
 * Coincide con la entidad Pago.java que devuelve el backend.
 */
export interface Pago {
  id: number;
  pedidoId: number;
  montoTotal: number;

  /**
   * Java 'LocalDateTime' se convierte en un string
   * en formato ISO (ej: "2025-11-10T15:30:00")
   */
  fecha: string;

  metodoPago: string;
  estado: EstadoPago;
}
