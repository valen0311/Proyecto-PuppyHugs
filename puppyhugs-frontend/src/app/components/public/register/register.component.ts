import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ClienteService } from '../../../services/cliente.service';
import { RegistroClienteRequest } from '../../../models/registro-cliente-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  public registerForm!: FormGroup;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public isSubmitting = false;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^([A-Z][a-z]*( [A-Z][a-z]*)*)$/)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{7,}$/)]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  public onSubmit(): void {
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

    this.clienteService.registrarCliente(registroRequest).subscribe({
      next: (cliente) => {
        this.successMessage = '✅ Registro exitoso. Redirigiendo al login...';
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Error en registro:', err);
        if (typeof err === 'string') {
          this.errorMessage = err;
        } else if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Error al registrar. Intente de nuevo.';
        }
      }
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
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
}
