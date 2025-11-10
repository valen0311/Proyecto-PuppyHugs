// Archivo: src/app/usuarios-admin/usuarios-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../services/autenticacion.service';
import { Usuario } from '../model/usuario.interface';
import { MatDialog } from '@angular/material/dialog';
// <<< Importar el Diálogo de Eliminación
import { EliminarDialogComponent } from '../eliminar-dialog/eliminar-dialog.component';

@Component({
  // ... (metadata) ...
})
export class UsuariosAdminComponent implements OnInit {

  clientes: Usuario[] = [];
  isLoading: boolean = true;

  constructor(
    private autenticacionService: AutenticacionService,
    private dialog: MatDialog // Asegúrate de que MatDialog esté inyectado
  ) { }

  // ... (ngOnInit, cargarClientes) ...

  /**
   * Elimina un cliente/usuario usando el diálogo de confirmación
   */
  eliminarCliente(cliente: Usuario): void {

    // <<< CAMBIO: Usar MatDialog en lugar de 'confirm()'
    const dialogRef = this.dialog.open(EliminarDialogComponent, {
      width: '350px',
      // Pasamos el nombre del cliente
      data: { nombreItem: cliente.nombreCompleto }
    });

    // Escuchamos el resultado
    dialogRef.afterClosed().subscribe(result => {
      // Si el usuario confirma la eliminación (result es true)
      if (result) {
        this.autenticacionService.eliminarUsuario(cliente.id).subscribe({
          next: () => {
            console.log('Cliente eliminado:', cliente.nombreCompleto);
            // Filtramos la lista para quitar el eliminado
            this.clientes = this.clientes.filter(c => c.id !== cliente.id);
          },
          error: (err) => {
            console.error('Error eliminando cliente:', err);
            // Cambiamos el alert simple por un mensaje en consola
            alert('No se pudo eliminar el cliente.');
          }
        });
      }
    });
  }
}
