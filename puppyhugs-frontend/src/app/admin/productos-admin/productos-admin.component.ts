import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'; // <-- Importante para errores

// 1. Importaciones clave
import { CommonModule, CurrencyPipe } from '@angular/common'; // CurrencyPipe es para el $
import { ReactiveFormsModule } from '@angular/forms';

// 2. Importar el servicio y los modelos
import { ProductoService } from '../../services/producto.service';
import { PromocionService } from '../../services/promocion.service';
import {
  Producto,
  CategoriaProducto,
  EstadoProducto
} from '../../models/producto.model';
import { Promocion } from '../../models/promocion.model';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  // 3. Declarar imports para *ngIf, *ngFor, formularios y el pipe de moneda
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './productos-admin.component.html',
  styleUrl: './productos-admin.component.css'
})
export class ProductosAdminComponent implements OnInit {

  // 4. Inyección de dependencias
  private productoService = inject(ProductoService);
  private promocionService = inject(PromocionService);
  private fb = inject(FormBuilder);

  // 5. Propiedades
  public productos: Producto[] = [];
  public productoForm!: FormGroup;
  public errorMessage: string | null = null;
  public isFormVisible: boolean = false; // Para mostrar/ocultar el form
  public editingProducto: Producto | null = null; // Producto que se está editando

  // 6. Arrays para los <select> (basados en tu Enum de Spring)
  public categorias: CategoriaProducto[] = ['ARTICULO', 'MEDICINA', 'ACCESORIO', 'JUGUETE'];
  public estados: EstadoProducto[] = ['ACTIVO', 'AGOTADO'];


  ngOnInit(): void {
    // 7. Inicializar el formulario
    this.productoForm = this.fb.group({
      // id no se incluye, lo genera el backend
      nombre: ['', Validators.required],
      codigoInterno: ['', Validators.required],
      categoria: ['ACCESORIO', Validators.required], // Valor por defecto
      cantidadDisponible: [0, [Validators.required, Validators.min(0)]],
      precio: [0.01, [Validators.required, Validators.min(0.01)]],
      estado: ['ACTIVO', Validators.required] // Valor por defecto
    });

    // 8. Cargar la lista de productos al iniciar
    this.cargarProductos();
  }

  /**
   * Obtiene todos los productos del servicio
   */
  public cargarProductos(): void {
    this.errorMessage = null;
    this.productoService.obtenerTodosLosProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar los productos. Verifique la conexión con el backend.';
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
      this.productoForm.reset({ // Resetea el form a los valores por defecto
        categoria: 'ACCESORIO',
        cantidadDisponible: 0,
        precio: 0.01,
        estado: 'ACTIVO'
      });
      this.editingProducto = null; // Resetea el producto en edición
    }
  }

  /**
   * Se llama al enviar el formulario (Crear o Actualizar)
   */
  public onSubmit(): void {
    this.productoForm.markAllAsTouched();
    if (this.productoForm.invalid) {
      return;
    }

    this.errorMessage = null;
    const datosProducto: Producto = this.productoForm.value;

    if (this.editingProducto) {
      // Actualizar producto existente
      this.productoService.actualizarProducto(this.editingProducto.id!, datosProducto).subscribe({
        next: (productoActualizado: Producto) => {
          const index = this.productos.findIndex(p => p.id === productoActualizado.id);
          if (index !== -1) {
            this.productos[index] = productoActualizado;
          }
          this.toggleForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Error al actualizar el producto. Verifique los datos e intente de nuevo.';
          }
        }
      });
    } else {
      // Registrar nuevo producto
      this.productoService.registrarProducto(datosProducto).subscribe({
        next: (productoGuardado: Producto) => {
          this.productos.push(productoGuardado);
          this.toggleForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Error al registrar el producto. Verifique los datos e intente de nuevo.';
          }
        }
      });
    }
  }

  /**
   * Carga los datos de un producto en el formulario para editar
   */
  public editarProducto(producto: Producto): void {
    this.editingProducto = producto;
    this.productoForm.patchValue({
      nombre: producto.nombre,
      codigoInterno: producto.codigoInterno,
      categoria: producto.categoria,
      cantidadDisponible: producto.cantidadDisponible,
      precio: producto.precio,
      estado: producto.estado
    });
    this.isFormVisible = true;
    this.errorMessage = null;
  }

  /**
   * Elimina un producto después de pedir confirmación
   */
  public eliminarProducto(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: (response) => {
          this.productos = this.productos.filter(p => p.id !== id);
          this.errorMessage = null;

          this.promocionService.getPromociones().subscribe({
            next: (promociones: Promocion[]) => {
              const promocionesAEliminar = promociones.filter(p => p.productoIds.includes(id));
              
              promocionesAEliminar.forEach(promo => {
                this.promocionService.eliminarPromocion(promo.id!).subscribe({
                  next: () => {
                    console.log(`Promoción ${promo.id} eliminada automáticamente`);
                  },
                  error: (err) => {
                    console.error(`Error al eliminar promoción ${promo.id}:`, err);
                  }
                });
              });
            },
            error: (err) => {
              console.error('Error al obtener promociones:', err);
            }
          });
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error || 'Error al eliminar el producto. Intente de nuevo.';
        }
      });
    }
  }
}
