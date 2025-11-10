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
}
