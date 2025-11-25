import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ClienteService } from '../../../services/cliente.service';
import { Cliente, Rol } from '../../../models/cliente.model';
import { RegistroClienteRequest } from '../../../models/registro-cliente-request.model';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css'
})
export class UsuariosAdminComponent implements OnInit {

  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);

  public usuarios: Cliente[] = [];
  public usuariosFiltrados: Cliente[] = [];
  public usuarioForm!: FormGroup;
  public errorMessage: string | null = null;
  public isFormVisible: boolean = false;
  public roles: Rol[] = ['ROL_CLIENTE', 'ROL_ADMIN'];
  public searchTerm: string = '';
  public isSearchActive: boolean = false;
  public noResultsMessage: string | null = null;

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^([A-Z][a-z]*( [A-Z][a-z]*)*)$/)]],
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
        this.usuariosFiltrados = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.errorMessage = 'Error al cargar los usuarios. Verifique la conexión con el backend.';
      }
    });
  }

  /**
   * Busca usuarios por nombre
   */
  public buscarUsuarios(): void {
    if (!this.searchTerm.trim()) {
      this.noResultsMessage = null;
      this.isSearchActive = false;
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    const termino = this.searchTerm.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nombreCompleto.toLowerCase().includes(termino)
    );

    this.isSearchActive = true;

    if (this.usuariosFiltrados.length === 0) {
      this.noResultsMessage = `❌ No se encontraron usuarios con el nombre "${this.searchTerm}".`;
    } else {
      this.noResultsMessage = null;
    }
  }

  /**
   * Limpia la búsqueda y muestra todos los usuarios
   */
  public limpiarBusqueda(): void {
    this.searchTerm = '';
    this.noResultsMessage = null;
    this.isSearchActive = false;
    this.usuariosFiltrados = this.usuarios;
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
