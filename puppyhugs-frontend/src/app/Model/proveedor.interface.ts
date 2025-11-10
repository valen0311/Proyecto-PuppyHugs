// Archivo: src/app/model/proveedor.interface.ts
// (Define el modelo Proveedor, idéntico al del backend)

export interface Proveedor {
  id: number;
  nombreComercial: string;
  identificacionFiscal: string; // (RUC, CUIT, NIF, etc.)
  correoElectronico: string;
  telefono: string;
  direccion: string;
  personaContacto: string;
}
