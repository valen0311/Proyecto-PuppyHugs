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

  /**
   * Llama al endpoint: PUT /api/productos/{id}
   * @param id El ID del producto a actualizar
   * @param producto Los datos actualizados del producto
   */
  public actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Producto>(url, producto);
  }

  /**
   * Llama al endpoint: DELETE /api/productos/{id}
   * @param id El ID del producto a eliminar
   */
  public eliminarProducto(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log('DELETE request a:', url);
    return this.http.delete(url, { responseType: 'text' });
  }
}
