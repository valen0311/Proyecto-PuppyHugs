import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  private http = inject(HttpClient);
  // URL del ProductoController
  private apiUrl = 'http://localhost:8080/api/productos';

  /**
   * Llama al endpoint: GET /api/productos
   */
  public obtenerTodosLosProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  /**
   * Llama al endpoint: POST /api/productos
   * @param producto El objeto Producto a registrar (sin ID)
   */
  public registrarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  // (Aquí añadiremos 'actualizar' y 'eliminar' cuando los necesitemos)
}
