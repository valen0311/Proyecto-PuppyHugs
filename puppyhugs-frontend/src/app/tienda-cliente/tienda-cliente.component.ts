// Archivo: src/app/tienda-cliente/tienda-cliente.component.ts (Requerido)

import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../model/producto.interface';
import { AutenticacionService } from '../services/autenticacion.service';

// --- IMPORTACIONES NECESARIAS PARA EL CARRITO ---
import { CarritoService } from '../services/carrito.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // <-- ¡MUY IMPORTANTE!

@Component({
  selector: 'app-tienda-cliente',
  templateUrl: './tienda-cliente.component.html',
  styleUrls: ['./tienda-cliente.component.css']
})
export class TiendaClienteComponent implements OnInit {

  productos: Producto[] = [];
  isLoading: boolean = true;
  nombreCliente: string | null = null;

  // --- VARIABLE PARA EL HEADER ---
  cantidadItemsCarrito$: Observable<number>;

  constructor(
    private productoService: ProductoService,
    private autenticacionService: AutenticacionService,
    private carritoService: CarritoService // <-- INYECTAR SERVICIO
  ) {
    // --- LÓGICA PARA EL HEADER ---
    // Mapea los items del carrito a solo la cantidad total
    this.cantidadItemsCarrito$ = this.carritoService.items$.pipe(
      map(items => items.reduce((total, item) => total + item.cantidad, 0))
    );
  }

  ngOnInit(): void {
    this.cargarProductos();
    const usuario = this.autenticacionService.usuarioActualValor;
    if (usuario) {
      this.nombreCliente = usuario.nombreCompleto;
    }
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data.filter(p => p.estado === 'ACTIVO');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Añade un producto al carrito
   */
  agregarAlCarrito(producto: Producto): void {
    // --- LÓGICA ACTUALIZADA ---
    this.carritoService.agregarProducto(producto);
    console.log('Añadido al carrito:', producto);
    // (Opcional: mostrar una notificación)
  }

  cerrarSesionCliente(): void {
    this.autenticacionService.logout();
  }
}
