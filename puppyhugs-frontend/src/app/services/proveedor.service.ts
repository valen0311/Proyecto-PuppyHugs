import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private http = inject(HttpClient);

  // ==========================================================
  //      CORRECCIÓN: Se elimina el "/v1" de la URL
  // ==========================================================
  private apiUrl = 'http://localhost:8080/api/proveedores';
  // ==========================================================

  /**
   * Conecta con: @GetMapping (en ProveedorController)
   * Recibe: ResponseEntity<List<Proveedor>>
   * Devuelve: Observable<Proveedor[]>
   */
  public obtenerTodosLosProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  /**
   * Conecta con: @PostMapping (en ProveedorController)
   * Envía: Un objeto JSON que coincide con ProveedorRequestDTO
   * Recibe: ResponseEntity<Proveedor> (el proveedor guardado)
   * Devuelve: Observable<Proveedor>
   */
  public registrarProveedor(proveedor: Proveedor): Observable<Proveedor> {
    // El objeto 'proveedor' de Angular (sin ID) coincide
    // con el 'ProveedorRequestDTO' que espera Spring.
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  // --- Métodos Opcionales (para el futuro) ---

  /**
   * Conecta con: @PutMapping("/{id}") (No implementado aún en tu controller)
   */
  public actualizarProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Proveedor>(url, proveedor);
  }

  /**
   * Conecta con: @DeleteMapping("/{id}") (No implementado aún en tu controller)
   */
  public eliminarProveedor(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
