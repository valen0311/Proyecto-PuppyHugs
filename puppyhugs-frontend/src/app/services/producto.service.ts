import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../model/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) { }

  /**
   * Conecta con: ProductoController -> @GetMapping
   * Obtiene la lista completa de productos.
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  /**
   * Conecta con: ProductoController -> @GetMapping("/{id}")
   * Obtiene un solo producto por su ID.
   */
  getProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Conecta con: ProductoController -> @PostMapping
   * (HU-1: Registrar Producto)
   * Envía un objeto Producto nuevo.
   * Nota: El backend le asignará el ID.
   */
  registrarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  /**
   * Conecta con: ProductoController -> @PutMapping("/{id}")
   * Envía un objeto Producto completo para actualizar uno existente.
   */
  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  /**
   * Conecta con: ProductoController -> @DeleteMapping("/{id}")
   * Borra un producto por su ID.
   */
  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
