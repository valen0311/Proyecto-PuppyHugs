// Archivo: src/app/services/autenticacion.service.ts
// (Antes llamado auth.service.ts)

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
// Importamos los modelos desde sus archivos
import { LoginRequest } from '../model/autenticacion.interfaces';
import { Cliente, Role } from '../model/cliente.interface';
import { Router } from '@angular/router'; // Importamos el Enrutador

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService { // <-- Nombre de la clase cambiado

  // 1. URL base de tu API (Ajusta el puerto si es necesario)
  // El backend controller sigue llamándose "auth"
  private apiUrl = 'http://localhost:8080/api/auth';

  // 2. BehaviorSubject para manejar el estado del usuario
  private usuarioActualSubject = new BehaviorSubject<Cliente | null>(null);
  public usuarioActual = this.usuarioActualSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Conecta con: AuthController -> @PostMapping("/login")
   * Envía el DTO LoginRequest y espera recibir un objeto Cliente.
   */
  login(credenciales: LoginRequest): Observable<Cliente> {
    // La URL del backend no cambia, sigue siendo /auth/login
    return this.http.post<Cliente>(`${this.apiUrl}/login`, credenciales)
      .pipe(
        tap(usuario => {
          // 3. Cuando el login es exitoso, guardamos el usuario
          this.usuarioActualSubject.next(usuario);
        })
      );
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    // 1. Informa a la app que ya no hay nadie logueado.
    this.usuarioActualSubject.next(null);

    // 2. Redirige al usuario a la página de login.
    this.router.navigate(['/login']);
  }

  // --- Helpers (Ayudantes) para los Guards ---

  /**
   * Devuelve el valor actual del usuario.
   */
  public get usuarioActualValor(): Cliente | null {
    return this.usuarioActualSubject.value;
  }

  /**
   * Verifica si el usuario logueado es Administrador.
   */
  public esAdmin(): boolean {
    return this.usuarioActualSubject.value?.rol === Role.ROL_ADMIN;
  }
}
