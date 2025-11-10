// src/app/models/cliente.model.ts

/**
 * Define los roles de usuario que existen en el backend.
 * Coincide con el enum Cliente.Role
 */
export type Rol = 'ROL_CLIENTE' | 'ROL_ADMIN';

/**
 * Interfaz para el modelo Cliente.
 * Coincide con la entidad Cliente.java
 * Se omite el password por seguridad (el backend no debe devolverlo).
 */
export interface Cliente {
  id: number; // Java 'Long' es 'number'
  nombreCompleto: string;
  correoElectronico: string;
  direccion: string;
  telefono: string;
  rol: Rol;
}