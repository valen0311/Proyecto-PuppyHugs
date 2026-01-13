import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../models/pago.model';
import { RegistroPagoRequest } from '../models/registro-pago-request.model';

@Injectable({
  providedIn: 'root',
})
export class PagoService {

  private http = inject(HttpClient);
  // URL del PagoController
  private apiUrl = 'http://localhost:8080/api/pagos';

  /**
   * Llama al endpoint: POST /api/pagos
   * @param pagoRequest El objeto con los datos del pago
   */
  public registrarPago(pagoRequest: RegistroPagoRequest): Observable<Pago> {
    return this.http.post<Pago>(this.apiUrl, pagoRequest);
  }

  /**
   * Obtiene todos los pagos
   * @returns Observable con la lista de pagos
   */
  public obtenerTodosLosPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.apiUrl);
  }

  /**
   * Obtiene un pago por su ID
   * @param id El ID del pago
   */
  public obtenerPagoPorId(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}/${id}`);
  }

  /**
   * Elimina un pago
   * @param id El ID del pago a eliminar
   */
  public eliminarPago(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}