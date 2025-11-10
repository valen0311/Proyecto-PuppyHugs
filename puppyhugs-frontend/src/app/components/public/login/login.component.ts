// src/app/components/public/login/login.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// 1. Importaciones clave para un componente Standalone
import { ReactiveFormsModule } from '@angular/forms'; // Para los formularios
import { CommonModule } from '@angular/common'; // Para usar *ngIf, *ngFor

// 2. Importamos el servicio y el modelo
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/login-request.model';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-login',
  standalone: true,
  // 3. Declaramos las importaciones que este componente necesita
  imports: [
    CommonModule,
    ReactiveFormsModule // Necesario para [formGroup] y formControlName
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  // 4. Inyección de dependencias
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // 5. Propiedades
  public loginForm!: FormGroup;
  public errorMessage: string | null = null;

  ngOnInit(): void {
    // --- IMPORTANTE: Limpiar sesión al cargar la página de login ---
    // Si un usuario (ej: admin) estaba logueado y visita /login,
    // cerramos su sesión anterior.
    localStorage.removeItem('usuarioLogueado');

    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  public onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }
    this.errorMessage = null;

    const credenciales: LoginRequest = this.loginForm.value;

    this.authService.login(credenciales).subscribe({
      next: (cliente: Cliente) => {

        // 1. Guardamos al usuario en el almacenamiento
        localStorage.setItem('usuarioLogueado', JSON.stringify(cliente));

        // 2. --- Lógica de Redirección por ROL ---
        if (cliente.rol === 'ROL_ADMIN') {
          // Si es Admin, va al dashboard de admin
          this.router.navigate(['/admin']);
        } else if (cliente.rol === 'ROL_CLIENTE') {
          // Si es Cliente, va a la tienda (que crearemos en la ruta '/')
          // (De momento lo mandamos a /login, pero luego lo cambiaremos a /tienda)
          console.log('Cliente logueado, redirigiendo a /tienda (Ruta no creada aún)');
          // Por ahora, solo para probar, lo mandamos a /admin/dashboard
          // this.router.navigate(['/tienda']);
          // Temporalmente lo dejamos en login para que no de error
          alert('Login de Cliente Exitoso (Ruta /tienda no creada aún)');

        } else {
          // Rol desconocido
          this.errorMessage = 'Rol de usuario no reconocido.';
        }
      },
      error: (err) => {
        console.error('Error en el login:', err);
        // Tu backend envía el mensaje en 'err.error'
        this.errorMessage = err.error || 'Error de conexión. Intente de nuevo.';
      }
    });
  }

  // --- Métodos auxiliares para el HTML ---
  public isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
