import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoginRequest } from './../models/login-request.model';
// ¡¡Importando tu modelo correcto!!
import { RegistroClienteRequest } from './../models/registro-cliente-request.model';
import { Cliente } from './../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  /**
   * Llama al endpoint: POST /api/auth/login
   */
  public login(credenciales: LoginRequest): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/login`, credenciales)
      .pipe(
        catchError(this.handleError)
      );
  }

  // ¡¡NUEVO MÉTODO!!
  /**
   * Llama al endpoint: POST /api/auth/register
   * @param datosRegistro Objeto con los datos del cliente
   * @returns Un Observable con el Cliente creado
   */
  public register(datosRegistro: RegistroClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/register`, datosRegistro)
      .pipe(
        catchError(this.handleError)
      );
  }


  /**
   * Manejo centralizado de errores HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error de conexión. Intente de nuevo.';

    if (error.error instanceof ErrorEvent) {
      console.error('Error del cliente:', error.error.message);
      errorMessage = 'Error de red. Verifique su conexión.';
    } else {
      console.error(`Código de error del servidor: ${error.status}`, error);

      if (error.status === 0) {
        errorMessage = 'No se pudo conectar al servidor. ¿Está el backend corriendo en http://localhost:8080?';
      } else if (error.status === 401) { // Error de Login
        errorMessage = typeof error.error === 'string' ? error.error : 'Usuario o contraseña incorrectos.';
      } else if (error.status === 400 || error.status === 409) { // Errores de Registro (ej: email ya existe)
        errorMessage = typeof error.error === 'string' ? error.error : 'Error en los datos enviados.';
      } else if (error.status === 404) {
        errorMessage = 'Endpoint no encontrado. Verifique la URL del backend.';
      } else {
        errorMessage = typeof error.error === 'string' ? error.error : 'Error en el servidor.';
      }
    }

    return throwError(() => errorMessage);
  }
}
