// Archivo: src/app/model/venta.interface.ts
// (Define el modelo Venta, idéntico al del backend)

import { Cliente } from './cliente.interface';
import { Producto } from './producto.interface';

// Representa el DTO DetalleVenta
export interface DetalleVenta {
  id: number;
  cantidad: number;
  precioUnitario: number; // Precio al momento de la venta
  producto: Producto; // El producto que se vendió
}

// Representa el DTO Venta
export interface Venta {
  id: number;
  fechaVenta: string; // (ISO date string)
  totalVenta: number;
  estadoVenta: string; // (ej: COMPLETADA, PENDIENTE)
  cliente: Cliente; // El cliente que compró
  detalles: DetalleVenta[]; // La lista de productos
}
