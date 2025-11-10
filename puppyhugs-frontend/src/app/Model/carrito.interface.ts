// Archivo: src/app/model/carrito.interface.ts

import { Producto } from './producto.interface';

// Un item en el carrito (un producto + la cantidad elegida)
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
