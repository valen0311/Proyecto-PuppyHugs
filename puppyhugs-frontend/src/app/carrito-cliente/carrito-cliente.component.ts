// Archivo: src/app/carrito-cliente/carrito-cliente.component.ts

import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { AutenticacionService } from '../services/autenticacion.service';
import { ItemCarrito } from '../model/carrito.interface';
import { Observable } from 'rxjs';
// (Importaremos el Dialog de Pago más adelante)

@Component({
  selector: 'app-carrito-cliente',
  templateUrl: './carrito-cliente.component.html',
  styleUrls: ['./carrito-cliente.component.css']
})
export class CarritoClienteComponent implements OnInit {

  // 'items$' es un Observable, el HTML se suscribirá a él con el pipe | async
  items$: Observable<ItemCarrito[]>;
  nombreCliente: string | null = null;

  constructor(
    private carritoService: CarritoService,
    private autenticacionService: AutenticacionService
    // private dialog: MatDialog // (luego)
  ) {
    // 1. Nos suscribimos al observable del servicio
    this.items$ = this.carritoService.items$;
  }

  ngOnInit(): void {
    // 2. Obtenemos el nombre del cliente para el saludo
    const usuario = this.autenticacionService.usuarioActualValor;
    if (usuario) {
      this.nombreCliente = usuario.nombreCompleto;
    }
  }

  /**
   * Llama al servicio para eliminar un item
   */
  eliminarDelCarrito(idProducto: number): void {
    this.carritoService.eliminarProducto(idProducto);
  }

  /**
   * Calcula el total (llamando al servicio)
   */
  calcularTotal(): number {
    return this.carritoService.calcularTotal();
  }

  /**
   * Cierra la sesión del cliente
   */
  cerrarSesionCliente(): void {
    this.autenticacionService.logout();
  }

  /**
   * (Simulación) Abre el diálogo para procesar el pago
   */
  procesarPago(): void {
    const total = this.calcularTotal();
    console.log(`Procesando pago por: $${total}`);
    // (Aquí se llamaría al VentaService.procesarVenta)

    alert('¡Gracias por tu compra! (Simulación)');
    this.carritoService.limpiarCarrito();
    // (Redirigir a una página de "gracias" o a la tienda)
  }
}
