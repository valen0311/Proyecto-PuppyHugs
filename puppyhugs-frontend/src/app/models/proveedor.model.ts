// src/app/models/proveedor.model.ts

/**
 * Interfaz que representa el modelo Proveedor.
 * Coincide con la entidad Proveedor.java
 */
export interface Proveedor {
  /**
   * El ID es opcional ('?') porque al registrar un proveedor (POST),
   * el frontend no envía un ID.
   */
  id?: number; // Java 'Long' es 'number'

  razonSocial: string;
  identificacionFiscal: string;
  direccion: string;
  telefono: string;
  correoElectronico: string;
  tipoProveedor: string;
}
