// Archivo: src/app/services/venta.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../model/venta.interface'; // Importamos el modelo

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  // URL base del VentaController
  private apiUrl = 'http://localhost:8080/api/ventas';

  constructor(private http: HttpClient) { }

  /**
   * Conecta con: VentaController -> @GetMapping
   * (HU-13: Reporte de Ventas)
   * Obtiene la lista completa de ventas.
   */
  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  // (Nota: En el futuro, aquí iría el servicio de 'procesarVenta' del cliente)
}
