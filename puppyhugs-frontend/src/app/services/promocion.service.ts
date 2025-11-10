import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promocion } from '../models/promocion.model';

@Injectable({
  providedIn: 'root',
})
export class PromocionService {

  private http = inject(HttpClient);
  // URL del PromocionController
  private apiUrl = 'http://localhost:8080/api/promociones';

  /**
   * Llama al endpoint: GET /api/promociones
   */
  public getPromociones(): Observable<Promocion[]> {
    return this.http.get<Promocion[]>(this.apiUrl);
  }

  /**
   * Llama al endpoint: POST /api/promociones
   * @param promocion El objeto Promocion a crear (sin ID)
   */
  public crearPromocion(promocion: Promocion): Observable<Promocion> {
    return this.http.post<Promocion>(this.apiUrl, promocion);
  }
}
