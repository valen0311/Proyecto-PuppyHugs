import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// 1. Importaciones clave
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// 2. Importar los servicios y los modelos
import { PagoService } from '../../../services/pago.service';
import { VentaService } from '../../../services/venta.service';
import { Pago } from '../../../models/pago.model'; // Para la respuesta
import { RegistroPagoRequest } from '../../../models/registro-pago-request.model'; // Para el formulario

@Component({
  selector: 'app-pago-admin',
  standalone: true,
  // 3. Declarar imports
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './pago-admin.component.html',
  styleUrl: './pago-admin.component.css'
})
export class PagoAdminComponent implements OnInit {

  // 4. Inyección de dependencias
  private pagoService = inject(PagoService);
  private ventaService = inject(VentaService);
  private fb = inject(FormBuilder);

  // 5. Propiedades
  public pagoForm!: FormGroup;
  public errorMessage: string | null = null;
  public successMessage: string | null = null; // Para feedback de éxito

  // 6. Arrays para los <select> (Ajusta esto a tu lógica de negocio)
  public metodosDePago: string[] = ['MASTERCARD'];


  ngOnInit(): void {
    // 7. Inicializar el formulario (basado en RegistroPagoRequest)
    this.pagoForm = this.fb.group({
      pedidoId: [1, [Validators.required, Validators.min(1)]],
      montoTotal: [0.01, [Validators.required, Validators.min(0.01)]],
      metodoPago: ['MASTERCARD', Validators.required] // Valor por defecto
    });
  }

  /**
   * Se llama al enviar el formulario (Adaptado a Pago)
   */
  public onSubmit(): void {
    console.log('🔴 Botón presionado, formulario válido:', this.pagoForm.valid);
    console.log('📋 Estado del formulario:', this.pagoForm);
    
    this.pagoForm.markAllAsTouched();
    if (this.pagoForm.invalid) {
      console.error('❌ Formulario inválido:', this.pagoForm);
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    const datosRegistro: RegistroPagoRequest = this.pagoForm.value;
    console.log('📤 Enviando pago a http://localhost:8080/api/pagos:', datosRegistro);

    this.pagoService.registrarPago(datosRegistro).subscribe({
      next: (pagoRegistrado: Pago) => {
        console.log('✅ Pago registrado exitosamente:', pagoRegistrado);

        const ventaId = datosRegistro.pedidoId;
        const pagoId = pagoRegistrado.id;

        this.ventaService.finalizarVenta(ventaId, pagoId).subscribe({
          next: (ventaFinalizada) => {
            console.log('✅ Venta finalizada:', ventaFinalizada);
            this.successMessage = `Pago #${pagoId} registrado y Venta #${ventaId} actualizada a PAGADA`;

            this.pagoForm.reset({
              pedidoId: 1,
              montoTotal: 0.01,
              metodoPago: 'MASTERCARD'
            });
            
            setTimeout(() => {
              this.successMessage = null;
            }, 5000);
          },
          error: (ventaErr) => {
            console.error('❌ Error al finalizar venta:', ventaErr);
            this.errorMessage = `Pago registrado pero error al actualizar la venta: ${ventaErr.error || ventaErr.statusText}`;
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Error en la respuesta:', err);
        console.error('Status:', err.status);
        console.error('Error body:', err.error);

        if (err.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor. Asegúrate de que el backend está corriendo en http://localhost:8080';
        } else if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = `Error ${err.status}: ${err.statusText || 'Error desconocido'}`;
        }
      }
    });
  }
}
