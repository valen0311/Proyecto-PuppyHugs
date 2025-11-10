// Archivo: src/app/model/cliente.interface.ts
// (Define la respuesta que esperamos del backend al hacer login)

export enum Role {
  ROL_CLIENTE = 'ROL_CLIENTE',
  ROL_ADMIN = 'ROL_ADMIN'
}

export interface Cliente {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  // No incluimos 'password' en la respuesta por seguridad
  direccion: string;
  telefono: string;
  rol: Role;
}
