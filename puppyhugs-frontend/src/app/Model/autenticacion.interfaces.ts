// Archivo: src/app/model/autenticacion.interfaces.ts
// (Define el DTO o JSON que ENVIAMOS al backend para hacer login)

export interface LoginRequest {
  correo: string;
  password: string;
}
