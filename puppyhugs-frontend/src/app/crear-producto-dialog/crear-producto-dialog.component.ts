// Archivo: src/app/crear-producto-dialog/crear-producto-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from '../services/producto.service';
import { Producto, EstadoProducto } from '../model/producto.interface';

@Component({
  selector: 'app-crear-producto-dialog',
  templateUrl: './crear-producto-dialog.component.html',
  styleUrls: ['./crear-producto-dialog.component.css']
})
export class CrearProductoDialogComponent implements OnInit {

  productoForm: FormGroup;
  modoEdicion: boolean = false;
  isLoading: boolean = false;

  // Obtenemos los Enums para usarlos en el HTML
  estadosProducto = Object.values(EstadoProducto);

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    // 1. 'dialogRef' es la referencia a esta misma ventana
    public dialogRef: MatDialogRef<CrearProductoDialogComponent>,
    // 2. 'MAT_DIALOG_DATA' son los datos que le pasamos (el producto a editar)
    @Inject(MAT_DIALOG_DATA) public data: Producto | null
  ) {
    // 3. Definimos el formulario
    this.productoForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      cantidadDisponible: [0, [Validators.required, Validators.min(0)]],
      estado: [EstadoProducto.ACTIVO, [Validators.required]] // Valor por defecto
    });

    // 4. Verificamos si nos pasaron datos (modo edición)
    if (this.data) {
      this.modoEdicion = true;
      // Llenamos el formulario con los valores del producto
      this.productoForm.patchValue(this.data);
    }
  }

  ngOnInit(): void { }

  /**
   * 5. Se llama al presionar el botón de "Guardar" o "Actualizar"
   */
  onGuardar(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const productoData: Producto = this.productoForm.value;

    if (this.modoEdicion) {
      // --- MODO EDICIÓN ---
      this.productoService.actualizarProducto(this.data!.id, productoData).subscribe({
        next: () => this.dialogRef.close(true), // Cierra y devuelve 'true' (éxito)
        error: (err) => {
          console.error('Error actualizando producto:', err);
          this.isLoading = false;
        }
      });

    } else {
      // --- MODO CREACIÓN ---
      // Desestructuramos para no enviar el 'id' nulo al crear
      const { id, ...nuevoProducto } = productoData;

      this.productoService.registrarProducto(nuevoProducto).subscribe({
        next: () => this.dialogRef.close(true), // Cierra y devuelve 'true' (éxito)
        error: (err) => {
          console.error('Error creando producto:', err);
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * 6. Se llama al presionar "Cancelar"
   */
  onCancelar(): void {
    this.dialogRef.close(); // Simplemente cierra el diálogo sin devolver nada
  }
}
