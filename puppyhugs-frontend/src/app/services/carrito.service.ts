// Archivo: src/app/services/carrito.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemCarrito } from '../model/carrito.interface';
import { Producto } from '../model/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  // 1. BehaviorSubject para "emitir" la lista de items a quien esté suscrito
  private itemsSubject = new BehaviorSubject<ItemCarrito[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor() { }

  /**
   * Obtiene los items actuales del carrito
   */
  getItems(): ItemCarrito[] {
    return this.itemsSubject.value;
  }

  /**
   * Añade un producto al carrito
   */
  agregarProducto(producto: Producto): void {
    const itemsActuales = this.getItems();
    const itemExistente = itemsActuales.find(i => i.producto.id === producto.id);

    if (itemExistente) {
      // Si ya existe, incrementa la cantidad
      itemExistente.cantidad++;
    } else {
      // Si es nuevo, lo añade con cantidad 1
      itemsActuales.push({ producto: producto, cantidad: 1 });
    }

    // Emite la nueva lista de items a todos los suscriptores
    this.itemsSubject.next(itemsActuales);
  }

  /**
   * Elimina un producto del carrito
   */
  eliminarProducto(idProducto: number): void {
    const itemsActuales = this.getItems();
    const itemsFiltrados = itemsActuales.filter(i => i.producto.id !== idProducto);
    this.itemsSubject.next(itemsFiltrados);
  }

  /**
   * Limpia todo el carrito
   */
  limpiarCarrito(): void {
    this.itemsSubject.next([]);
  }

  /**
   * Calcula el total del carrito
   */
  calcularTotal(): number {
    const itemsActuales = this.getItems();
    return itemsActuales.reduce((total, item) => {
      return total + (item.producto.precio * item.cantidad);
    }, 0);
  }
}
