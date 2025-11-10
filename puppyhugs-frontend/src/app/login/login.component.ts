// Archivo: src/app/login/login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../services/autenticacion.service';
import { LoginRequest } from '../model/autenticacion.interfaces';
import { Cliente, Role } from '../model/cliente.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,        // Constructor de formularios
    private autenticacionService: AutenticacionService, // El "Puente"
    private router: Router          // Para redirigir al usuario
  ) {
    // 1. Definir la estructura del formulario y sus validaciones
    this.loginForm = this.fb.group({
      // El 'name' del formControlName debe coincidir con el HTML
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Se llama cuando el usuario presiona el botón "Ingresar".
   */
  onSubmit(): void {
    // 2. Si el formulario tiene errores, no hacer nada
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Marca todos los campos como "tocados"
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // 3. Crear el DTO (JSON) a partir de los datos del formulario
    const credenciales: LoginRequest = {
      correo: this.loginForm.value.correo,
      password: this.loginForm.value.password
    };

    // 4. Llamar al servicio (el puente)
    this.autenticacionService.login(credenciales).subscribe({
      next: (usuario: Cliente) => {
        // --- ÉXITO ---
        this.isLoading = false;
        console.log('Login exitoso:', usuario);

        // 5. Redirigir según el ROL (¡Esta es la lógica clave!)
        // Esto reemplaza el "@if" que tenías en app.component.html
        if (usuario.rol === Role.ROL_ADMIN) {
          this.router.navigate(['/dashboard-admin']);
        } else {
          this.router.navigate(['/tienda-cliente']);
        }
      },
      error: (error) => {
        // --- ERROR ---
        this.isLoading = false;
        console.error('Error en el login:', error);
        // Este mensaje viene de tu 'AuthController'
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}
