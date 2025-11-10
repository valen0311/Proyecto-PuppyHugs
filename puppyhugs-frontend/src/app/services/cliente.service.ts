// Archivo: src/app/services/cliente.service.ts

import { Injectable } from '@angular...';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../model/cliente.interface';
import { RegistroRequest } from '../model/registro.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) { }

  /**
   * 1. USADO POR: RegisterComponent
   * (Paso 6)
   */
  registrarCliente(datosRegistro: RegistroRequest): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/registrar`, datosRegistro);
  }

  /**
   * 2. USADO POR: UsuariosAdminComponent
   * (Paso 14)
   */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  /**
   * 3. USADO POR: UsuariosAdminComponent
   * (Paso 14)
   */
  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
