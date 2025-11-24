import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta.model';

@Injectable({
  providedIn: 'root',
})
export class VentaService {

  private http = inject(HttpClient);
  // URL del VentaController
  private apiUrl = 'http://localhost:8080/api/ventas';

  /**
   * Llama al endpoint: GET /api/ventas
   */
  public getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  /**
   * Llama al endpoint: POST /api/ventas
   * @param venta El objeto Venta a crear (sin ID)
   */
  public crearVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta);
  }

  /**
   * Llama al endpoint: PUT /api/ventas/{ventaId}/finalizar?pagoId={pagoId}
   * Actualiza el estado de la venta a PAGADA después de registrar un pago
   * @param ventaId El ID de la venta a finalizar
   * @param pagoId El ID del pago registrado
   */
  public finalizarVenta(ventaId: number, pagoId: number): Observable<Venta> {
    return this.http.put<Venta>(`${this.apiUrl}/${ventaId}/finalizar?pagoId=${pagoId}`, {});
  }
}
