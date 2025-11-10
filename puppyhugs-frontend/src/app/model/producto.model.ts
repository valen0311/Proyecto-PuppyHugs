// src/app/models/producto.model.ts

/**
 * Tipos para los Enums de Java.
 */
export type CategoriaProducto = 'ARTICULO' | 'MEDICINA' | 'ACCESORIO' | 'JUGUETE';
export type EstadoProducto = 'ACTIVO' | 'AGOTADO';

/**
 * Interfaz que representa el modelo Producto.
 * Coincide con el DTO/Entidad de Spring.
 */
export interface Producto {
  /**
   * El ID es opcional ('?') porque al crear un producto nuevo,
   * el frontend aún no conoce el ID que asignará el backend.
   */
  id?: number; // Java 'Long' se convierte en 'number'
  nombre: string;
  codigoInterno: string;
  categoria: CategoriaProducto;
  cantidadDisponible: number; // Java 'int' se convierte en 'number'
  precio: number; // Java 'BigDecimal' se convierte en 'number'
  estado: EstadoProducto;
}
