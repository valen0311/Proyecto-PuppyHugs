import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'; // <-- Importante para errores

// 1. Importaciones clave
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// 2. Importar el servicio y el modelo
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../models/proveedor.model';

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
  public editingProveedor: Proveedor | null = null;

  // 6. Arrays para los <select>
  public tiposProveedor: string[] = ['Higiene', 'Equipos Médicos', 'Alimentos', 'Accesorios', 'Medicinas'];


  ngOnInit(): void {
    // 7. Inicializar el formulario
    this.proveedorForm = this.fb.group({
      razonSocial: ['', Validators.required],
      identificacionFiscal: ['', [Validators.required, Validators.minLength(8)]],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      tipoProveedor: ['Higiene', Validators.required]
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
   * Muestra u oculta el formulario de registro/edición
   */
  public toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    this.errorMessage = null;
    if (!this.isFormVisible) {
      this.proveedorForm.reset({
        tipoProveedor: 'Higiene'
      });
      this.editingProveedor = null;
    }
  }

  /**
   * Se llama al enviar el formulario (Crear o Actualizar)
   */
  public onSubmit(): void {
    this.proveedorForm.markAllAsTouched();
    if (this.proveedorForm.invalid) {
      return;
    }

    this.errorMessage = null;
    const datosProveedor: Proveedor = this.proveedorForm.value;

    if (this.editingProveedor) {
      // Actualizar proveedor existente
      this.proveedorService.actualizarProveedor(this.editingProveedor.id!, datosProveedor).subscribe({
        next: (proveedorActualizado: Proveedor) => {
          const index = this.proveedores.findIndex(p => p.id === proveedorActualizado.id);
          if (index !== -1) {
            this.proveedores[index] = proveedorActualizado;
          }
          this.toggleForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Error al actualizar el proveedor. Verifique los datos e intente de nuevo.';
          }
        }
      });
    } else {
      // Registrar nuevo proveedor
      this.proveedorService.registrarProveedor(datosProveedor).subscribe({
        next: (proveedorGuardado: Proveedor) => {
          this.proveedores.push(proveedorGuardado);
          this.toggleForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Error al registrar el proveedor. Verifique los datos e intente de nuevo.';
          }
        }
      });
    }
  }

  /**
   * Carga los datos de un proveedor en el formulario para editar
   */
  public editarProveedor(proveedor: Proveedor): void {
    this.editingProveedor = proveedor;
    this.proveedorForm.patchValue({
      razonSocial: proveedor.razonSocial,
      identificacionFiscal: proveedor.identificacionFiscal,
      correoElectronico: proveedor.correoElectronico,
      telefono: proveedor.telefono,
      direccion: proveedor.direccion,
      tipoProveedor: proveedor.tipoProveedor
    });
    this.isFormVisible = true;
    this.errorMessage = null;
  }

  /**
   * Elimina un proveedor después de pedir confirmación
   */
  public eliminarProveedor(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe({
        next: (response) => {
          this.proveedores = this.proveedores.filter(p => p.id !== id);
          this.errorMessage = null;
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error || 'Error al eliminar el proveedor. Intente de nuevo.';
        }
      });
    }
  }
}
