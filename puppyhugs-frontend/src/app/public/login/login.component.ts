import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';
import { LoginRequest } from '../../models/login-request.model';
import { RegistroClienteRequest } from '../../models/registro-cliente-request.model';
import { Cliente } from '../../models/cliente.model';

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
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public showRegisterForm = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public isSubmitting = false;

  constructor() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^([A-Z][a-z]*( [A-Z][a-z]*)*)$/)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{7,}$/)]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuarioLogueado');
    }
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  public toggleRegisterForm(): void {
    this.showRegisterForm = !this.showRegisterForm;
    this.errorMessage = null;
    this.successMessage = null;
  }

  public onRegisterSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;
    this.isSubmitting = true;

    const formValue = this.registerForm.value;
    const registroRequest: RegistroClienteRequest = {
      nombreCompleto: formValue.nombreCompleto,
      correoElectronico: formValue.correoElectronico,
      password: formValue.password,
      direccion: formValue.direccion,
      telefono: formValue.telefono
    };

    console.log('📤 Enviando registro:', registroRequest);

    this.clienteService.registrarCliente(registroRequest).subscribe({
      next: (cliente) => {
        console.log('✅ Registro exitoso:', cliente);
        this.successMessage = '✅ Registro exitoso. Ahora inicia sesión.';
        this.registerForm.reset();
        setTimeout(() => {
          this.showRegisterForm = false;
        }, 2000);
        this.isSubmitting = false;
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('❌ Error completo:', err);
        console.error('Status:', err.status);
        console.error('Error body:', err.error);
        
        let mensajeError = 'Error al registrar. Intente de nuevo.';
        
        if (err.status === 400) {
          if (typeof err.error === 'string') {
            mensajeError = err.error;
          } else if (err.error && typeof err.error === 'object') {
            mensajeError = Object.values(err.error).join(' | ');
          }
        } else if (err.status === 0) {
          mensajeError = 'No se pudo conectar con el servidor. Verifica que el backend esté activo.';
        } else if (err.status >= 500) {
          mensajeError = 'Error en el servidor. Intenta más tarde.';
        }
        
        this.errorMessage = mensajeError;
      }
    });
  }

  public isFieldInvalid(fieldName: string, form: FormGroup): boolean {
    const control = form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public getFieldError(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return `${fieldName} es obligatorio`;
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['pattern']) {
      if (fieldName === 'nombreCompleto') {
        return 'Solo letras, sin números. Cada palabra debe iniciar con mayúscula (ej: Juan Pérez)';
      }
      return 'Teléfono inválido (mínimo 7 dígitos)';
    }
    return 'Campo inválido';
  }

  public passwordsMatch(): boolean {
    return this.registerForm.errors?.['passwordMismatch'] ? false : true;
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

  public isLoginFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
