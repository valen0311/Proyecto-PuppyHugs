// Archivo: src/app/crear-proveedor-dialog/crear-proveedor-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveedorService } from '../services/proveedor.service';
import { Proveedor } from '../model/proveedor.interface';

@Component({
  selector: 'app-crear-proveedor-dialog',
  templateUrl: './crear-proveedor-dialog.component.html',
  // Reusamos el CSS del diálogo de producto
  styleUrls: ['../crear-producto-dialog/crear-producto-dialog.component.css']
})
export class CrearProveedorDialogComponent implements OnInit {

  proveedorForm: FormGroup;
  modoEdicion: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    // 1. 'dialogRef' es la referencia a esta misma ventana
    public dialogRef: MatDialogRef<CrearProveedorDialogComponent>,
    // 2. 'MAT_DIALOG_DATA' son los datos que le pasamos (el proveedor a editar)
    @Inject(MAT_DIALOG_DATA) public data: Proveedor | null
  ) {
    // 3. Definimos el formulario
    this.proveedorForm = this.fb.group({
      id: [null],
      nombreComercial: ['', [Validators.required]],
      identificacionFiscal: ['', [Validators.required]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      personaContacto: ['', [Validators.required]]
    });

    // 4. Verificamos si nos pasaron datos (modo edición)
    if (this.data) {
      this.modoEdicion = true;
      // Llenamos el formulario con los valores del proveedor
      this.proveedorForm.patchValue(this.data);
    }
  }

  ngOnInit(): void { }

  /**
   * 5. Se llama al presionar el botón de "Guardar" o "Actualizar"
   */
  onGuardar(): void {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const proveedorData = this.proveedorForm.value;

    if (this.modoEdicion) {
      // --- MODO EDICIÓN ---
      this.proveedorService.actualizarProveedor(this.data!.id, proveedorData).subscribe({
        next: () => this.dialogRef.close(true), // Cierra y devuelve 'true'
        error: (err) => {
          console.error('Error actualizando:', err);
          this.isLoading = false;
        }
      });

    } else {
      // --- MODO CREACIÓN ---
      const { id, ...nuevoProveedor } = proveedorData; // Quitamos el ID nulo

      this.proveedorService.registrarProveedor(nuevoProveedor).subscribe({
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
