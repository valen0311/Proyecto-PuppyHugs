// Archivo: src/app/model/promocion.interface.ts
// (Define el modelo Promocion, idéntico al del backend)

export enum TipoPromocion {
  DESCUENTO_PORCENTAJE = 'DESCUENTO_PORCENTAJE',
  DESCUENTO_MONTO_FIJO = 'DESCUENTO_MONTO_FIJO',
  ENVIO_GRATIS = 'ENVIO_GRATIS'
}

export interface Promocion {
  id: number;
  codigo: string;
  descripcion: string;
  tipo: TipoPromocion;
  valorDescuento: number; // Puede ser % o monto fijo
  fechaInicio: string; // Usamos string para simpleza (ISO date)
  fechaFin: string; // Usamos string para simpleza (ISO date)
  activo: boolean;
}
