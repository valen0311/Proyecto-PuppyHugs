// Archivo: src/app/usuarios-admin/usuarios-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service'; // Importamos el servicio
import { Cliente, Role } from '../model/cliente.interface'; // Importamos el modelo

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  // Reusamos el CSS de productos para mantener la consistencia
  styleUrls: ['../productos-admin/productos-admin.component.css']
})
export class UsuariosAdminComponent implements OnInit {

  // Arreglo para guardar los clientes de la API
  usuarios: Cliente[] = [];
  isLoading: boolean = true;

  // Guardamos el Enum Role para usarlo en el HTML
  Roles = Role;

  constructor(
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  /**
   * Llama al servicio para obtener todos los clientes
   */
  cargarUsuarios(): void {
    this.isLoading = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
        console.log('Usuarios cargados:', data);
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Llama al servicio para eliminar un usuario
   */
  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      this.clienteService.eliminarCliente(id).subscribe({
        next: () => {
          console.log('Usuario eliminado');
          // Quita el usuario de la lista local
          this.usuarios = this.usuarios.filter(u => u.id !== id);
        },
        error: (err) => {
          console.error('Error eliminando usuario:', err);
          alert('No se pudo eliminar el usuario.');
        }
      });
    }
  }

  // (Nota: No hay 'Editar' ya que no creamos un diálogo para usuarios)
  // (Nota: No hay 'Crear' ya que los usuarios se crean en el Registro)
}
