import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// 1. Importaciones clave
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// 2. Importar el SERVICIO y los MODELOS correctos
import { ClienteService } from '../../../services/cliente.service';
import { Cliente, Rol } from '../../../models/cliente.model';
// Asegúrate de que esta ruta sea correcta
import { RegistroClienteRequest } from '../../../models/registro-cliente-request.model';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css'
})
export class UsuariosAdminComponent implements OnInit {

  // Inyección de dependencias
  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);

  // Propiedades
  public usuarios: Cliente[] = [];
  public usuarioForm!: FormGroup;
  public errorMessage: string | null = null;
  public isFormVisible: boolean = false;
  public roles: Rol[] = ['ROL_CLIENTE', 'ROL_ADMIN'];

  ngOnInit(): void {
    // Inicializar el formulario (coincide con RegistroClienteRequest)
    this.usuarioForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['ROL_CLIENTE', Validators.required]
    });

    this.cargarUsuarios();
  }

  /**
   * Obtiene todos los usuarios
   */
  public cargarUsuarios(): void {
    this.errorMessage = null;

    // ==========================================================
    //      CORRECCIÓN: Llamamos al método getClientes()
    // ==========================================================
    this.clienteService.getClientes().subscribe({ // <-- CAMBIO
      next: (data: Cliente[]) => {
        this.usuarios = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.errorMessage = 'Error al cargar los usuarios. Verifique la conexión con el backend.';
      }
    });
  }

  /**
   * Muestra u oculta el formulario
   */
  public toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    this.errorMessage = null;
    if (!this.isFormVisible) {
      this.usuarioForm.reset({
        rol: 'ROL_CLIENTE'
      });
    }
  }

  /**
   * Envía el formulario de registro
   */
  public onSubmit(): void {
    this.usuarioForm.markAllAsTouched();
    if (this.usuarioForm.invalid) {
      return;
    }

    this.errorMessage = null;

    // ==========================================================
    //   CORRECCIÓN: El objeto enviado es de tipo RegistroClienteRequest
    // ==========================================================
    const datosRegistro: RegistroClienteRequest = this.usuarioForm.value;

    this.clienteService.registrarCliente(datosRegistro).subscribe({ // <-- CORREGIDO
      next: (usuarioGuardado: Cliente) => {
        this.usuarios.push(usuarioGuardado);
        this.toggleForm();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Error al registrar el usuario. Verifique los datos.';
        }
      }
    });
  }
}
