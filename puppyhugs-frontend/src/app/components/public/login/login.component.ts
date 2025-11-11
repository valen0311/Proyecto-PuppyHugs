import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/login-request.model';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  public loginForm: FormGroup;
  public errorMessage: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuarioLogueado');
    }
  }

  public onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;
    const credenciales: LoginRequest = this.loginForm.value;

    console.log('🔄 Enviando petición de login...', credenciales);

    this.authService.login(credenciales).subscribe({
      next: (cliente: Cliente) => {
        console.log('✅ Respuesta exitosa del servidor:', cliente);

        // Guardar usuario en localStorage
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('usuarioLogueado', JSON.stringify(cliente));
        }

        // Redirigir según rol
        if (cliente.rol === 'ROL_ADMIN') {
          console.log('👨‍💼 Admin detectado, redirigiendo a /admin');
          this.router.navigate(['/admin']);
        } else if (cliente.rol === 'ROL_CLIENTE') {
          console.log('👤 Cliente detectado');
          alert('Login de Cliente Exitoso (Ruta /tienda no creada aún)');
        } else {
          this.errorMessage = 'Rol de usuario no reconocido.';
        }
      },
      error: (errorMsg: string) => {
        console.error('❌ Error en el login:', errorMsg);
        this.errorMessage = errorMsg;
      }
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
