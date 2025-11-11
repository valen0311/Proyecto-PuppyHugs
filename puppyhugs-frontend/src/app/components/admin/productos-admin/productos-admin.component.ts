import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// 1. Importaciones clave
import { CommonModule, CurrencyPipe } from '@angular/common'; // CurrencyPipe es para el $
import { ReactiveFormsModule } from '@angular/forms';

// 2. Importar el servicio y los modelos
import { ProductoService } from '../../../services/producto.service';
import {
  Producto,
  CategoriaProducto,
  EstadoProducto
} from '../../../models/producto.model';

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
  private fb = inject(FormBuilder);

  // 5. Propiedades
  public productos: Producto[] = [];
  public productoForm!: FormGroup;
  public errorMessage: string | null = null;
  public isFormVisible: boolean = false; // Para mostrar/ocultar el form

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
   * Muestra u oculta el formulario de registro
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
    }
  }

  /**
   * Se llama al enviar el formulario (HU-1)
   */
  public onSubmit(): void {
    this.productoForm.markAllAsTouched();
    if (this.productoForm.invalid) {
      return;
    }

    this.errorMessage = null;
    const nuevoProducto: Producto = this.productoForm.value;

    this.productoService.registrarProducto(nuevoProducto).subscribe({
      next: (productoGuardado) => {
        // Éxito:
        // 1. Añadimos el nuevo producto a la lista (sin recargar la página)
        this.productos.push(productoGuardado);
        // 2. Ocultamos y reseteamos el formulario
        this.toggleForm();
      },
      error: (err) => {
        // 3. Mostramos el error de Spring (ej: "Producto duplicado")
        console.error(err);
        this.errorMessage = err.error || 'Error al registrar el producto.';
      }
    });
  }
}
