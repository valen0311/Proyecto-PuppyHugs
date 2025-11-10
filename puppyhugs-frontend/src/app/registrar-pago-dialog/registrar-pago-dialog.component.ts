import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoPago } from '../model/pago.interface';

// Definimos la data que le pasamos: solo el monto total a pagar
export interface PagoDialogData {
  montoTotal: number;
}

@Component({
  selector: 'app-registrar-pago-dialog',
  templateUrl: './registrar-pago-dialog.component.html',
  // Reusamos el CSS del diálogo de producto
  styleUrls: ['../crear-producto-dialog/crear-producto-dialog.component.css']
})
export class RegistrarPagoDialogComponent implements OnInit {

  pagoForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegistrarPagoDialogComponent>,
    // Recibimos el monto total
    @Inject(MAT_DIALOG_DATA) public data: PagoDialogData
  ) {
    // 1. Definimos el formulario de simulación de pago
    this.pagoForm = this.fb.group({
      nombreTitular: ['', [Validators.required]],
      // Simulación de tarjeta con longitud y patrón
      numeroTarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiracion: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]], // MM/AA
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  ngOnInit(): void { }

  /**
   * Procesa el formulario y devuelve la información de pago (InfoPago)
   */
  onPagar(): void {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const pagoData: InfoPago = this.pagoForm.value;

    // Devolvemos los datos del pago. La lógica de Venta va en CarritoClienteComponent
    this.dialogRef.close(pagoData);
  }

  onCancelar(): void {
    this.dialogRef.close(null); // Devolvemos null si cancela
  }
}
