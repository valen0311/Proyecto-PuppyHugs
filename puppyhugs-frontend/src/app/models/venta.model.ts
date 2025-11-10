// src/app/models/venta.model.ts

/**
 * Define los estados de la venta.
 * Coincide con el enum Venta.EstadoVenta
 */
export type EstadoVenta = 'PENDIENTE_DE_PAGO' | 'PAGADA' | 'CANCELADA';

/**
 * Interfaz que representa el modelo Venta (o Pedido).
 * Coincide con la entidad Venta.java
 */
export interface Venta {
  /**
   * El ID es opcional ('?') porque al crear una venta (POST),
   * el frontend no envía un ID.
   */
  id?: number; // Java 'Long' es 'number'

  clienteId: number;

  /**
   * Un 'Map<Long, Integer>' de Java se serializa en JSON
   * como un objeto { "key1": value1, "key2": value2 }.
   * 'Record<number, number>' es el tipo correcto en TypeScript.
   * (Ej: { 101: 2, 105: 1 } -> Producto 101, 2 unidades)
   */
  productos: Record<number, number>;

  totalVenta: number; // Java 'BigDecimal' es 'number'

  /**
   * Java 'LocalDateTime' se convierte en un string
   * en formato ISO (ej: "2025-11-10T15:30:00")
   */
  fecha: string;

  estado: EstadoVenta;

  /**
   * El pagoId puede ser nulo si la venta aún está PENDIENTE.
   * Por eso usamos 'number | null'.
   */
  pagoId: number | null;
}
