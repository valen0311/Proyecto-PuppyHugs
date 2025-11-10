// Archivo: src/app/carrito-cliente/carrito-cliente.component.ts (Actualizado)

import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { AutenticacionService } from '../services/autenticacion.service';
import { ItemCarrito } from '../model/carrito.interface';
import { Observable } from 'rxjs';
import { VentaService } from '../services/venta.service'; // <<< IMPORTACIÓN
import { VentaRegistroDTO } from '../model/pago.interface'; // <<< IMPORTACIÓN

import { MatDialog } from '@angular/material/dialog'; // <<< IMPORTACIÓN
import { RegistrarPagoDialogComponent } from '../registrar-pago-dialog/registrar-pago-dialog.component'; // <<< IMPORTACIÓN
import { Router } from '@angular/router'; // <<< IMPORTACIÓN

@Component({
  // ... (metadata) ...
})
export class CarritoClienteComponent implements OnInit {

  items$: Observable<ItemCarrito[]>;
  nombreCliente: string | null = null;

  constructor(
    private carritoService: CarritoService,
    private autenticacionService: AutenticacionService,
    private ventaService: VentaService, // <<< INYECCIÓN
    private dialog: MatDialog, // <<< INYECCIÓN
    private router: Router // <<< INYECCIÓN
  ) {
    this.items$ = this.carritoService.items$;
  }

  // ... (ngOnInit, eliminarDelCarrito, calcularTotal, cerrarSesionCliente) ...

  /**
   * Abre el diálogo de pago y procesa la venta si el pago es exitoso
   */
  procesarPago(): void {
    const total = this.calcularTotal();

    // 1. Abrir el diálogo de pago
    const dialogRef = this.dialog.open(RegistrarPagoDialogComponent, {
      width: '450px',
      data: { montoTotal: total } // Pasamos el monto total
    });

    // 2. Escuchamos el resultado del diálogo
    dialogRef.afterClosed().subscribe(pagoData => {
      // Si el usuario ingresó los datos y presionó Pagar (no es null)
      if (pagoData) {

        const usuario = this.autenticacionService.usuarioActualValor;
        const itemsCarrito = this.carritoService.getItems();

        // Creamos el DTO a enviar al backend
        const ventaDto: VentaRegistroDTO = {
          idCliente: usuario!.id,
          totalVenta: total,
          items: itemsCarrito.map(item => ({
            idProducto: item.producto.id,
            cantidad: item.cantidad
          }))
        };

        // 3. Llamar al servicio de venta
        this.ventaService.procesarVenta(ventaDto).subscribe({
          next: (ventaConfirmada) => {
            console.log('Venta registrada con éxito:', ventaConfirmada);
            alert(¡Gracias por tu compra! ID de Venta: #${ventaConfirmada.id});

            // 4. Limpiar el carrito y redirigir a la tienda
            this.carritoService.limpiarCarrito();
            this.router.navigate(['/tienda-cliente']);
          },
          error: (err) => {
            console.error('Error al registrar la venta:', err);
            alert('Error al procesar el pago. Por favor, intente de nuevo.');
          }
        });
      }
    });
  }
}
