// Archivo: src/app/services/autenticacion.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginRequest } from '../model/autenticacion.interfaces';
import { Cliente, Role } from '../model/cliente.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  // 1. URL base de tu API (Ajusta el puerto si es necesario)
  // Esta URL coincide con el @RequestMapping de tu AuthController
  private apiUrl = 'http://localhost:8080/api/auth';

  // 2. BehaviorSubject para manejar el estado del usuario
  // Esto permite que toda la app sepa "quién" está logueado.
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
    // 3. Llama al endpoint exacto: POST /api/auth/login
    return this.http.post<Cliente>(${this.apiUrl}/login, credenciales)
      .pipe(
        tap(usuario => {
          // 4. Cuando el login es exitoso, guardamos el usuario
          // en nuestro "estado" global (el BehaviorSubject).
          this.usuarioActualSubject.next(usuario);

          // (Aquí es donde se guardaría el token o usuario en localStorage)
        })
      );
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    // 1. Borra el usuario del estado global.
    this.usuarioActualSubject.next(null);

    // (Aquí se borraría el token de localStorage)

    // 2. Redirige al usuario a la página de login.
    this.router.navigate(['/login']);
  }

  // --- Helpers (Ayudantes) para los Guards ---

  /**
   * Devuelve el valor actual del usuario (para el AuthGuard).
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
