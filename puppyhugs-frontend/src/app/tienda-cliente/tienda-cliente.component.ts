// Archivo: src/app/tienda-cliente/tienda-cliente.component.ts

import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../model/producto.interface';
import { AutenticacionService } from '../services/autenticacion.service';
// (Importaremos el CarritoService más adelante)

@Component({
  selector: 'app-tienda-cliente',
  templateUrl: './tienda-cliente.component.html',
  styleUrls: ['./tienda-cliente.component.css']
})
export class TiendaClienteComponent implements OnInit {

  productos: Producto[] = [];
  isLoading: boolean = true;
  // Guardamos el nombre del cliente para el saludo
  nombreCliente: string | null = null;

  constructor(
    private productoService: ProductoService,
    private autenticacionService: AutenticacionService
    // private carritoService: CarritoService // (luego)
  ) { }

  ngOnInit(): void {
    // 1. Cargar el catálogo de productos
    this.cargarProductos();

    // 2. Obtener el nombre del cliente logueado
    const usuario = this.autenticacionService.usuarioActualValor;
    if (usuario) {
      this.nombreCliente = usuario.nombreCompleto;
    }
  }

  /**
   * Llama al servicio para obtener todos los productos
   */
  cargarProductos(): void {
    this.isLoading = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        // Filtramos para mostrar solo productos 'ACTIVOS'
        this.productos = data.filter(p => p.estado === 'ACTIVO');
        this.isLoading = false;
        console.log('Catálogo cargado:', this.productos);
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
    console.log('Añadiendo al carrito (WIP):', producto);
    // (Aquí llamaremos al CarritoService en el futuro)
    // this.carritoService.agregarProducto(producto);
    alert(`${producto.nombre} añadido al carrito (simulación)`);
  }

  /**
   * Cierra la sesión del cliente
   */
  cerrarSesionCliente(): void {
    this.autenticacionService.logout();
  }
}
