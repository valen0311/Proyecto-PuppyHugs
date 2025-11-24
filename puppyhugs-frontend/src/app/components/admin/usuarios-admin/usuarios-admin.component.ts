import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ClienteService } from '../../../services/cliente.service';
import { Cliente, Rol } from '../../../models/cliente.model';
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

  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);

  public usuarios: Cliente[] = [];
  public usuarioForm!: FormGroup;
  public errorMessage: string | null = null;
  public isFormVisible: boolean = false;
  public roles: Rol[] = ['ROL_CLIENTE', 'ROL_ADMIN'];

  ngOnInit(): void {
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

    this.clienteService.getClientes().subscribe({
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

    const datosRegistro: RegistroClienteRequest = this.usuarioForm.value;

    this.clienteService.registrarCliente(datosRegistro).subscribe({
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
