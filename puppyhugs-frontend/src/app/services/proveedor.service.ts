// Archivo: src/app/services/proveedor.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../model/proveedor.interface';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  // URL base del ProveedorController en tu backend (asumiendo que está en el puerto 8080)
  private apiUrl = 'http://localhost:8080/api/proveedores';

  constructor(private http: HttpClient) { }

  /**
   * Conecta con: ProveedorController -> @GetMapping
   * Obtiene la lista completa de proveedores.
   */
  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  /**
   * Conecta con: ProveedorController -> @PostMapping
   * Registra un nuevo proveedor en el sistema.
   * @param proveedor El objeto Proveedor a registrar (sin ID).
   */
  registrarProveedor(proveedor: Omit<Proveedor, 'id'>): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  /**
   * Conecta con: ProveedorController -> @PutMapping/{id}
   * Actualiza la información de un proveedor existente.
   * @param id El ID del proveedor a actualizar.
   * @param proveedor El objeto Proveedor con los datos actualizados.
   */
  actualizarProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, proveedor);
  }

  /**
   * Conecta con: ProveedorController -> @DeleteMapping/{id}
   * Elimina un proveedor por su ID.
   * @param id El ID del proveedor a eliminar.
   */
  eliminarProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
