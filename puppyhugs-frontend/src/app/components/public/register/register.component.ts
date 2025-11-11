import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';
// ¡¡Importando tu modelo correcto!!
import { RegistroClienteRequest } from '../../../models/registro-cliente-request.model';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-register',
  standalone: true,
  // ¡¡Importante añadir todos los módulos!!
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public registerForm: FormGroup;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  constructor() {
    // ¡¡FORMULARIO ACTUALIZADO para coincidir con tu modelo!!
    this.registerForm = this.fb.group({
      nombreCompleto: ['', [Validators.required]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });
  }

  public onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    // ¡¡Esto ahora coincide con tu modelo!!
    const datosRegistro: RegistroClienteRequest = this.registerForm.value;

    console.log('🔄 Enviando petición de registro...', datosRegistro);

    this.authService.register(datosRegistro).subscribe({
      next: (cliente: Cliente) => {
        console.log('✅ Registro exitoso:', cliente);
        this.successMessage = '¡Registro exitoso! Redirigiendo al login...';

        // Espera 2 segundos y redirige al login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (errorMsg: string) => {
        console.error('❌ Error en el registro:', errorMsg);
        this.errorMessage = errorMsg;
      }
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
