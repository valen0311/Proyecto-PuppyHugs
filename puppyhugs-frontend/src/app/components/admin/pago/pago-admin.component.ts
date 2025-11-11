import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// 1. Importaciones clave
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// 2. Importar el servicio y los modelos
import { PagoService } from '../../../services/pago.service';
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
  private fb = inject(FormBuilder);

  // 5. Propiedades
  public pagoForm!: FormGroup;
  public errorMessage: string | null = null;
  public successMessage: string | null = null; // Para feedback de éxito

  // 6. Arrays para los <select> (Ajusta esto a tu lógica de negocio)
  public metodosDePago: string[] = ['TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'PAYPAL'];


  ngOnInit(): void {
    // 7. Inicializar el formulario (basado en RegistroPagoRequest)
    this.pagoForm = this.fb.group({
      pedidoId: [null, [Validators.required, Validators.min(1)]],
      montoTotal: [0.01, [Validators.required, Validators.min(0.01)]],
      metodoPago: ['TARJETA_CREDITO', Validators.required] // Valor por defecto
    });
  }

  /**
   * Se llama al enviar el formulario (Adaptado a Pago)
   */
  public onSubmit(): void {
    this.pagoForm.markAllAsTouched();
    if (this.pagoForm.invalid) {
      return;
    }

    // Limpiar mensajes anteriores
    this.errorMessage = null;
    this.successMessage = null;

    const datosRegistro: RegistroPagoRequest = this.pagoForm.value;

    this.pagoService.registrarPago(datosRegistro).subscribe({
      // La respuesta (pagoRegistrado) es de tipo Pago
      next: (pagoRegistrado: Pago) => {
        // Éxito:
        this.successMessage = `Pago #${pagoRegistrado.id} registrado exitosamente. Estado: ${pagoRegistrado.estado}`;

        // Reseteamos el formulario a sus valores iniciales
        this.pagoForm.reset({
          pedidoId: null,
          montoTotal: 0.01,
          metodoPago: 'TARJETA_CREDITO'
        });
      },
      error: (err: HttpErrorResponse) => {
        // Mostramos el error de Spring
        console.error(err);
        if (typeof err.error === 'string') {
          // Ej: "El Pedido ID no existe" o "El pedido ya tiene un pago"
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Error al registrar el pago. Verifique los datos.';
        }
      }
    });
  }
}
