import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// 1. Importaciones clave
import { CommonModule, PercentPipe } from '@angular/common'; // PercentPipe es para el %
import { ReactiveFormsModule } from '@angular/forms';

// 2. Importar los servicios y los modelos
import { PromocionService } from '../../services/promocion.service';
import { Promocion } from '../../models/promocion.model';
import { ProductoService } from '../../services/producto.service'; // <- Servicio adicional
import { Producto } from '../../models/producto.model'; // <- Modelo adicional

@Component({
  selector: 'app-promociones-admin',
  standalone: true,
  // 3. Declarar imports para *ngIf, *ngFor, formularios y el pipe de porcentaje
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PercentPipe // <-- Equivalente a CurrencyPipe para este caso
  ],
  templateUrl: './promociones-admin.component.html',
  styleUrl: './promociones-admin.component.css'
})
export class PromocionesAdminComponent implements OnInit {

  // 4. Inyección de dependencias
  private promocionService = inject(PromocionService);
  private productoService = inject(ProductoService); // <- Inyectamos ambos
  private fb = inject(FormBuilder);

  // 5. Propiedades
  public promociones: Promocion[] = [];
  public promocionForm!: FormGroup;
  public errorMessage: string | null = null;
  public isFormVisible: boolean = false;
  public editingPromocion: Promocion | null = null;

  // 6. Array para el <select> (se cargará desde el servicio)
  public todosLosProductos: Producto[] = [];


  ngOnInit(): void {
    // 7. Inicializar el formulario
    this.promocionForm = this.fb.group({
      // id no se incluye, lo genera el backend
      nombre: ['', Validators.required],
      // El backend espera 0.25 para 25%
      descuento: [0.01, [Validators.required, Validators.min(0.01), Validators.max(1.0)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      // El <select multiple> necesita un array
      productoIds: [[], [Validators.required, Validators.minLength(1)]]
    });

    // 8. Cargar las listas al iniciar
    this.cargarPromociones();
    this.cargarTodosLosProductos(); // <-- Cargamos también los productos
  }

  /**
   * Obtiene todas las promociones del servicio
   */
  public cargarPromociones(): void {
    this.errorMessage = null;
    this.promocionService.getPromociones().subscribe({
      next: (data) => {
        this.promociones = data;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar las promociones.';
      }
    });
  }
  

  /**
   * (Función extra) Obtiene todos los productos para el <select>
   */
  public cargarTodosLosProductos(): void {
    this.productoService.obtenerTodosLosProductos().subscribe({
      next: (data) => {
        this.todosLosProductos = data;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar la lista de productos.';
      }
    });
  }

  /**
   * Muestra u oculta el formulario de registro/edición
   */
  public toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    this.errorMessage = null;
    if (!this.isFormVisible) {
      this.promocionForm.reset({
        descuento: 0.01,
        productoIds: []
      });
      this.editingPromocion = null;
    }
  }

  /**
   * Se llama al enviar el formulario (Crear o Actualizar)
   */
  public onSubmit(): void {
    this.promocionForm.markAllAsTouched();
    if (this.promocionForm.invalid) {
      return;
    }

    this.errorMessage = null;

    const formValue = this.promocionForm.value;
    const datosPromocion: Promocion = {
      ...formValue,
      productoIds: formValue.productoIds.map((id: string) => Number(id))
    };

    if (this.editingPromocion) {
      this.promocionService.actualizarPromocion(this.editingPromocion.id!, datosPromocion).subscribe({
        next: (promocionActualizada: Promocion) => {
          const index = this.promociones.findIndex(p => p.id === promocionActualizada.id);
          if (index !== -1) {
            this.promociones[index] = promocionActualizada;
          }
          this.toggleForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Error al actualizar la promoción. Verifique los datos e intente de nuevo.';
          }
        }
      });
    } else {
      this.promocionService.crearPromocion(datosPromocion).subscribe({
        next: (promocionGuardada) => {
          this.promociones.push(promocionGuardada);
          this.toggleForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Error al registrar la promoción. Verifique los datos e intente de nuevo.';
          }
        }
      });
    }
  }

  /**
   * Carga los datos de una promoción en el formulario para editar
   */
  public editarPromocion(promocion: Promocion): void {
    this.editingPromocion = promocion;
    this.promocionForm.patchValue({
      nombre: promocion.nombre,
      descuento: promocion.descuento,
      fechaInicio: promocion.fechaInicio,
      fechaFin: promocion.fechaFin,
      productoIds: promocion.productoIds
    });
    this.isFormVisible = true;
    this.errorMessage = null;
  }

  /**
   * Elimina una promoción después de pedir confirmación
   */
  public eliminarPromocion(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta promoción?')) {
      this.promocionService.eliminarPromocion(id).subscribe({
        next: (response) => {
          this.promociones = this.promociones.filter(p => p.id !== id);
          this.errorMessage = null;
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error || 'Error al eliminar la promoción. Intente de nuevo.';
        }
      });
    }
  }
}
