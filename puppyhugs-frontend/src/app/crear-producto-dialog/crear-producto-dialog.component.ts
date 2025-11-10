// Archivo: src/app/crear-producto-dialog/crear-producto-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from '../services/producto.service';
import { CategoriaProducto, EstadoProducto, Producto } from '../model/producto.interface';

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
  categorias = Object.values(CategoriaProducto);
  estados = Object.values(EstadoProducto);

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    // 1. 'dialogRef' es la referencia a esta misma ventana
    public dialogRef: MatDialogRef<CrearProductoDialogComponent>,
    // 2. 'MAT_DIALOG_DATA' son los datos que le pasamos al abrirlo (ej: el producto a editar)
    @Inject(MAT_DIALOG_DATA) public data: Producto | null
  ) {
    // 3. Definimos el formulario (similar a Login/Register)
    this.productoForm = this.fb.group({
      id: [null], // El ID es importante para la edición
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigoInterno: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      cantidadDisponible: [0, [Validators.required, Validators.min(0)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      estado: ['', [Validators.required]]
    });

    // 4. Verificamos si nos pasaron datos
    if (this.data) {
      this.modoEdicion = true;
      // Si 'data' existe, llenamos el formulario con esos valores
      this.productoForm.patchValue(this.data);
    } else {
      // Si es nuevo, ponemos 'ACTIVO' por defecto
      this.productoForm.patchValue({ estado: EstadoProducto.ACTIVO });
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
    const productoData = this.productoForm.value;

    if (this.modoEdicion) {
      // --- MODO EDICIÓN ---
      // Llamamos al servicio de actualizar
      this.productoService.actualizarProducto(this.data!.id, productoData).subscribe({
        next: () => this.dialogRef.close(true), // Cierra el diálogo y devuelve 'true'
        error: (err) => {
          console.error('Error actualizando:', err);
          this.isLoading = false;
        }
      });

    } else {
      // --- MODO CREACIÓN ---
      // Quitamos el ID nulo antes de enviar, como pide el servicio
      const { id, ...nuevoProducto } = productoData;

      this.productoService.registrarProducto(nuevoProducto).subscribe({
        next: () => this.dialogRef.close(true), // Cierra el diálogo y devuelve 'true'
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
