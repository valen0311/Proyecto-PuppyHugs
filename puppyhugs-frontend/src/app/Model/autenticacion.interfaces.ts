// Archivo: src/app/model/autenticacion.interfaces.ts
// (Antes llamado auth.interfaces.ts)

// Esta interfaz define el JSON que ENVIAMOS al backend para hacer login
export interface LoginRequest {
  correo: string;
  password: string;
}
