// Archivo: src/app/services/promocion.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promocion } from '../model/promocion.interface'; // Importamos el modelo

@Injectable({
  providedIn: 'root'
})
export class PromocionService {

  // URL base del PromocionController
  private apiUrl = 'http://localhost:8080/api/promociones';

  constructor(private http: HttpClient) { }

  /**
   * Conecta con: PromocionController -> @GetMapping
   * Obtiene la lista completa de promociones.
   */
  getPromociones(): Observable<Promocion[]> {
    return this.http.get<Promocion[]>(this.apiUrl);
  }

  /**
   * Conecta con: PromocionController -> @PostMapping
   * (HU-9: Registrar Promoción)
   * Envía un objeto Promocion nuevo.
   */
  registrarPromocion(promocion: Omit<Promocion, 'id'>): Observable<Promocion> {
    return this.http.post<Promocion>(this.apiUrl, promocion);
  }

  /**
   * Conecta con: PromocionController -> @PutMapping("/{id}")
   * Envía un objeto Promocion completo para actualizar uno existente.
   */
  actualizarPromocion(id: number, promocion: Promocion): Observable<Promocion> {
    return this.http.put<Promocion>(`${this->apiUrl}/${id}`, promocion);
  }

  /**
   * Conecta con: PromocionController -> @DeleteMapping("/{id}")
   * Borra una promoción por su ID.
   */
  eliminarPromocion(id: number): Observable<void> {
    return this.http.delete<void>(`${this->apiUrl}/${id}`);
  }
}
