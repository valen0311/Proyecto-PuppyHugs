// src/app/models/registro-pago-request.model.ts

/**
 * Interfaz para la petición de registro de un Pago.
 * Contiene solo los campos que el frontend envía.
 */
export interface RegistroPagoRequest {
  pedidoId: number; // Java 'Long' es 'number'
  montoTotal: number; // Java 'BigDecimal' es 'number'
  metodoPago: string; // Ej: "MASTERCARD"
}
