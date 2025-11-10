import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../model/venta.interface';
import { VentaRegistroDTO } from '../model/pago.interface'; // <<< IMPORTACIÓN

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  // URL base del VentaController
  private apiUrl = 'http://localhost:8080/api/ventas';

  constructor(private http: HttpClient) { }

  /**
   * Conecta con: VentaController -> @GetMapping
   * Obtiene la lista completa de ventas (para el admin).
   */
  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  /**
   * Conecta con: VentaController -> @PostMapping
   * Registra una nueva venta desde el flujo del cliente (HU-11).
   * @param ventaDto Los datos de la venta a registrar.
   */
  procesarVenta(ventaDto: VentaRegistroDTO): Observable<Venta> { // <<< NUEVO MÉTODO
    // El backend recibe el DTO y registra la venta, los detalles y la asocia al cliente.
    console.log("Enviando DTO de Venta al backend:", ventaDto);
    return this.http.post<Venta>(this.apiUrl, ventaDto);
  }
}
