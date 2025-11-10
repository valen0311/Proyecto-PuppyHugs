import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  // URL del AutenticacionController
  private apiUrl = 'http://localhost:8080/api/auth';

  /**
   * Llama al endpoint: POST /api/auth/login
   * @param credenciales Objeto con 'correo' y 'password'
   * @returns Un Observable con el Cliente autenticado
   */
  public login(credenciales: LoginRequest): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/login`, credenciales);
  }
}
