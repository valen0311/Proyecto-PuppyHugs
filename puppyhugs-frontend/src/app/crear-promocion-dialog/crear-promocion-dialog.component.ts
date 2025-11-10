import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PromocionService } from '../services/promocion.service';
import { Promocion, TipoPromocion } from '../model/promocion.interface';

@Component({
  selector: 'app-crear-promocion-dialog',
  templateUrl: './crear-promocion-dialog.component.html',
  // Reusamos el CSS del diálogo de producto
  styleUrls: ['../crear-producto-dialog/crear-producto-dialog.component.css']
})
export class CrearPromocionDialogComponent implements OnInit {

  promocionForm: FormGroup;
  modoEdicion: boolean = false;
  isLoading: boolean = false;

  // Obtenemos los Enums para usarlos en el HTML
  tiposPromocion = Object.values(TipoPromocion);

  constructor(
    private fb: FormBuilder,
    private promocionService: PromocionService,
    // 1. 'dialogRef' es la referencia a esta misma ventana
    public dialogRef: MatDialogRef<CrearPromocionDialogComponent>,
    // 2. 'MAT_DIALOG_DATA' son los datos que le pasamos (la promo a editar)
    @Inject(MAT_DIALOG_DATA) public data: Promocion | null
  ) {
    // 3. Definimos el formulario
    this.promocionForm = this.fb.group({
      id: [null],
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      valorDescuento: [0, [Validators.required, Validators.min(0)]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      activo: [true, [Validators.required]] // Por defecto 'true'
    });

    // 4. Verificamos si nos pasaron datos (modo edición)
    if (this.data) {
      this.modoEdicion = true;
      // Llenamos el formulario con los valores de la promoción
      // Formateamos las fechas para el input 'date'
      this.promocionForm.patchValue({
        ...this.data,
        fechaInicio: this.formatDate(this.data.fechaInicio),
        fechaFin: this.formatDate(this.data.fechaFin)
      });
    }
  }

  ngOnInit(): void { }

  /**
   * Helper para formatear fechas al tipo 'yyyy-MM-dd'
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ''; // Devuelve vacío si la fecha es inválida
    }
    // Asegura que la fecha esté en formato YYYY-MM-DD para el input
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 5. Se llama al presionar el botón de "Guardar" o "Actualizar"
   */
  onGuardar(): void {
    if (this.promocionForm.invalid) {
      this.promocionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const promoData = this.promocionForm.value;

    if (this.modoEdicion) {
      // --- MODO EDICIÓN ---
      this.promocionService.actualizarPromocion(this.data!.id, promoData).subscribe({
        next: () => this.dialogRef.close(true), // Cierra y devuelve 'true'
        error: (err) => {
          console.error('Error actualizando:', err);
          this.isLoading = false;
        }
      });

    } else {
      // --- MODO CREACIÓN ---
      const { id, ...nuevaPromo } = promoData; // Quitamos el ID nulo

      this.promocionService.registrarPromocion(nuevaPromo).subscribe({
        next: () => this.dialogRef.close(true), // Cierra y devuelve 'true'
        error: (err) => {
          console.error('Error creando:', err);
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * 6. Se llama al presionar "Cancelar"
   */
  onCancelar(): void {
    this.dialogRef.close(); // Simplemente cierra el diálogo
  }
}
