// src/app/models/login-request.model.ts

/**
 * Interfaz para la petición de Login.
 * Coincide con el DTO LoginRequest.java
 */
export interface LoginRequest {
  correo: string;
  password: string;
}
