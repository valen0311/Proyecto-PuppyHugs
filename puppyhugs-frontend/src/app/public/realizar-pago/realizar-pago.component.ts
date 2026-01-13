// src/app/public/realizar-pago/realizar-pago.component.ts

import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { PagoService } from '../../services/pago.service';
import { VentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/producto.service';
import { Pago } from '../../models/pago.model';
import { RegistroPagoRequest } from '../../models/registro-pago-request.model';
import { Venta } from '../../models/venta.model';
import { Cliente } from '../../models/cliente.model';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-realizar-pago',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './realizar-pago.component.html',
  styleUrl: './realizar-pago.component.css'
})
export class RealizarPagoComponent implements OnInit {

  private pagoService = inject(PagoService);
  private ventaService = inject(VentaService);
  private productoService = inject(ProductoService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  public pagoForm!: FormGroup;
  public cliente: Cliente | null = null;
  public errorMessage: string | null = null;
  
  // Lista de productos disponibles
  public productos: Producto[] = [];
  public productosLoading: boolean = true;
  
  // Estados de animación
  public isProcessing: boolean = false;
  public isSuccess: boolean = false;
  public pagoRegistrado: Pago | null = null;
  public ventaRegistrada: Venta | null = null;

  ngOnInit(): void {
    // Obtener cliente del localStorage
    if (isPlatformBrowser(this.platformId)) {
      const userStorage = localStorage.getItem('usuarioLogueado');
      if (userStorage) {
        this.cliente = JSON.parse(userStorage);
      }
    }

    // Inicializar formulario
    this.pagoForm = this.fb.group({
      productoId: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      metodoPago: ['MASTERCARD', Validators.required]
    });

    // Cargar productos disponibles
    this.cargarProductos();
  }

  /**
   * Carga los productos disponibles desde el backend
   */
  private cargarProductos(): void {
    this.productosLoading = true;
    
    this.productoService.obtenerTodosLosProductos().subscribe({
      next: (productos: Producto[]) => {
        // Filtrar productos activos con stock disponible
        this.productos = productos.filter(p => 
          p.estado === 'ACTIVO' && p.cantidadDisponible > 0
        );
        this.productosLoading = false;
        console.log('✅ Productos cargados:', this.productos);
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Error al cargar productos:', err);
        this.productosLoading = false;
        this.errorMessage = 'Error al cargar productos. Verifica que el backend esté corriendo.';
      }
    });
  }

  /**
   * Calcula el monto total basado en producto y cantidad seleccionados
   */
  public get montoTotal(): number {
    const productoId = this.pagoForm.get('productoId')?.value;
    const cantidad = this.pagoForm.get('cantidad')?.value || 0;
    
    if (productoId && cantidad > 0) {
      const producto = this.productos.find(p => p.id === Number(productoId));
      if (producto && producto.precio) {
        return Number(producto.precio) * Number(cantidad);
      }
    }
    
    return 0;
  }

  /**
   * Obtiene el producto seleccionado
   */
  public get productoSeleccionado(): Producto | null {
    const productoId = this.pagoForm.get('productoId')?.value;
    if (productoId) {
      return this.productos.find(p => p.id === Number(productoId)) || null;
    }
    return null;
  }

  /**
   * Maneja el envío del formulario de pago
   */
  public onSubmit(): void {
    this.pagoForm.markAllAsTouched();
    if (this.pagoForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      return;
    }

    if (!this.cliente) {
      this.errorMessage = 'No se encontró información del cliente. Por favor inicia sesión nuevamente.';
      return;
    }

    this.errorMessage = null;
    this.isProcessing = true;
    this.isSuccess = false;

    // Simular delay de 5-6 segundos antes de procesar
    setTimeout(() => {
      this.procesarPago();
    }, 5500); // 5.5 segundos
  }

  /**
   * Procesa el pago y crea la venta
   */
  private procesarPago(): void {
    const productoId = Number(this.pagoForm.get('productoId')?.value);
    const cantidad = Number(this.pagoForm.get('cantidad')?.value);
    const metodoPago = this.pagoForm.get('metodoPago')?.value;

    // Crear venta
    const ventaData: any = {
      clienteId: this.cliente!.id,
      productos: {
        [productoId]: cantidad
      }
    };

    this.ventaService.crearVenta(ventaData).subscribe({
      next: (venta: Venta) => {
        console.log('✅ Venta creada:', venta);
        this.ventaRegistrada = venta;

        // Registrar el pago
        const pagoData: RegistroPagoRequest = {
          pedidoId: Number(venta.id),
          montoTotal: this.montoTotal,
          metodoPago: metodoPago
        };

        this.pagoService.registrarPago(pagoData).subscribe({
          next: (pago: Pago) => {
            console.log('✅ Pago registrado:', pago);
            this.pagoRegistrado = pago;
            this.isProcessing = false;
            this.isSuccess = true;

            // Redirigir a ver-factura después de 2 segundos
            setTimeout(() => {
              this.router.navigate(['/cliente/factura'], {
                queryParams: { ventaId: venta.id }
              });
            }, 2000);
          },
          error: (err: HttpErrorResponse) => {
            console.error('❌ Error al registrar pago:', err);
            this.isProcessing = false;
            this.errorMessage = 'Error al procesar el pago. Por favor intenta nuevamente.';
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Error al crear venta:', err);
        this.isProcessing = false;
        this.isSuccess = false;

        if (err.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté corriendo.';
        } else if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = `Error al procesar la venta: ${err.statusText || 'Error desconocido'}`;
        }
      }
    });
  }

  /**
   * Verifica si un campo del formulario es inválido
   */
  public isFieldInvalid(fieldName: string): boolean {
    const control = this.pagoForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}