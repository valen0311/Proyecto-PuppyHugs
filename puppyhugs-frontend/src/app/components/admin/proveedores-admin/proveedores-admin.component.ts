import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'; // <-- Importante para errores

// 1. Importaciones clave
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// 2. Importar el servicio y el modelo
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../models/proveedor.model';

@Component({
  selector: 'app-proveedores-admin',
  standalone: true,
  // 3. Declarar imports
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './proveedores-admin.component.html',
  styleUrl: './proveedores-admin.component.css'
})
export class ProveedoresAdminComponent implements OnInit {

  // 4. Inyección de dependencias
  private proveedorService = inject(ProveedorService);
  private fb = inject(FormBuilder);

  // 5. Propiedades
  public proveedores: Proveedor[] = [];
  public proveedorForm!: FormGroup;
  public errorMessage: string | null = null;
  public isFormVisible: boolean = false;

  // 6. Arrays para los <select>
  public tiposProveedor: string[] = ['NACIONAL', 'INTERNACIONAL'];


  ngOnInit(): void {
    // 7. Inicializar el formulario
    this.proveedorForm = this.fb.group({
      razonSocial: ['', Validators.required],
      identificacionFiscal: ['', [Validators.required, Validators.minLength(8)]],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      tipoProveedor: ['NACIONAL', Validators.required]
    });

    // 8. Cargar la lista de proveedores al iniciar
    this.cargarProveedores();
  }

  /**
   * Obtiene todos los proveedores del servicio
   */
  public cargarProveedores(): void {
    this.errorMessage = null;
    this.proveedorService.obtenerTodosLosProveedores().subscribe({
      // Tipado estricto para 'data'
      next: (data: Proveedor[]) => {
        this.proveedores = data;
      },
      // Tipado estricto para 'err'
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.errorMessage = 'Error al cargar los proveedores. Verifique la conexión con el backend.';
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
      this.proveedorForm.reset({
        tipoProveedor: 'NACIONAL'
      });
    }
  }

  /**
   * Se llama al enviar el formulario (Adaptado a Proveedor)
   */
  public onSubmit(): void {
    this.proveedorForm.markAllAsTouched();
    if (this.proveedorForm.invalid) {
      return;
    }

    this.errorMessage = null;
    const nuevoProveedor: Proveedor = this.proveedorForm.value;

    this.proveedorService.registrarProveedor(nuevoProveedor).subscribe({
      // Tipado estricto para 'proveedorGuardado'
      next: (proveedorGuardado: Proveedor) => {
        // Éxito:
        this.proveedores.push(proveedorGuardado);
        this.toggleForm();
      },
      // Tipado estricto y manejo de error mejorado
      error: (err: HttpErrorResponse) => {
        console.error(err);
        if (typeof err.error === 'string') {
          // 1. Error de Negocio (String)
          // (Viene del 'IllegalArgumentException' en Spring, ej: "El RUC ya existe")
          this.errorMessage = err.error;
        } else {
          // 2. Error de Validación (Objeto) o error genérico
          // (Viene del @Valid o un 500)
          this.errorMessage = 'Error al registrar el proveedor. Verifique los datos e intente de nuevo.';
        }
      }
    });
  }
}
