// src/app/models/registro-cliente-request.model.ts

/**
 * Interfaz para ENVIAR los datos del formulario de registro.
 * Coincide con los campos que tu backend espera en el @RequestBody
 * para crear un nuevo Cliente.
 */
export interface RegistroClienteRequest {
  nombreCompleto: string;
  correoElectronico: string;
  password: string;
  direccion: string;
  telefono: string;

  /**
   * Nota: No incluimos 'id' (lo genera el backend)
   * ni 'rol' (tu backend lo asigna por defecto).
   */
}
