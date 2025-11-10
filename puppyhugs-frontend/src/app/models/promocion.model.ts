// src/app/models/promocion.model.ts

/**
 * Interfaz que representa el modelo Promocion.
 * Coincide con la entidad Promocion.java
 */
export interface Promocion {
  /**
   * El ID es opcional ('?') porque al crear una promoción nueva (POST),
   * el frontend no envía un ID.
   */
  id?: number; // Java 'Long' es 'number'

  nombre: string;

  /**
   * El backend lo maneja como BigDecimal, pero para TypeScript/JSON
   * lo tratamos como un 'number' (ej: 0.25 para 25%)
   */
  descuento: number;

  /**
   * Java 'LocalDate' se serializa a un string en formato ISO
   * (ej: "2025-10-31")
   */
  fechaInicio: string;
  fechaFin: string;

  /**
   * Java 'Set<Long>' se convierte en un array de 'number'
   */
  productoIds: number[];
}
