import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cliente } from '../models/cliente.model';
import { RegistroClienteRequest } from '../models/registro-cliente-request.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {

  private http = inject(HttpClient);
  // URL del ClienteController
  private apiUrl = 'http://localhost:8080/api/clientes';

  /**
   * Llama al endpoint: GET /api/clientes
   * (Modificado para soportar búsqueda, como discutimos)
   * @param search Término de búsqueda opcional
   * @returns Un Observable con un array de clientes
   */
  public getClientes(search: string = ""): Observable<Cliente[]> {
    let params = new HttpParams();
    if (search) {
      params = params.append('search', search);
    }
    return this.http.get<Cliente[]>(this.apiUrl, { params: params });
  }

  /**
   * Llama al endpoint: POST /api/clientes
   * @param clienteRequest El objeto con los datos del formulario de registro
   * @returns Un Observable con el cliente recién creado
   */
  public registrarCliente(clienteRequest: RegistroClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, clienteRequest);
  }
}
