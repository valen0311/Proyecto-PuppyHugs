// Archivo: src/app/services/proveedor.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../model/proveedor.interface'; // Importamos el modelo

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  // URL base del ProveedorController
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
   * (HU-5: Registrar Proveedor)
   * Envía un objeto Proveedor nuevo.
   */
  registrarProveedor(proveedor: Omit<Proveedor, 'id'>): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  /**
   * Conecta con: ProveedorController -> @PutMapping("/{id}")
   * Envía un objeto Proveedor completo para actualizar uno existente.
   */
  actualizarProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(${this.apiUrl}/${id}, proveedor);
  }

  /**
   * Conecta con: ProveedorController -> @DeleteMapping("/{id}")
   * Borra un proveedor por su ID.
   */
  eliminarProveedor(id: number): Observable<void> {
    return this.http.delete<void>(${this.apiUrl}/${id});
  }
}
