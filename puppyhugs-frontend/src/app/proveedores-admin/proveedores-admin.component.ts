// Archivo: src/app/proveedores-admin/proveedores-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../services/proveedor.service';
import { Proveedor } from '../model/proveedor.interface';
import { MatDialog } from '@angular/material/dialog';
// <<< Importar el Diálogo de Eliminación
import { EliminarDialogComponent } from '../eliminar-dialog/eliminar-dialog.component';
// Importar el Diálogo de Creación (ya debe estar)
import { CrearProveedorDialogComponent } from '../crear-proveedor-dialog/crear-proveedor-dialog.component';

@Component({
  // ... (metadata) ...
})
export class ProveedoresAdminComponent implements OnInit {

  proveedores: Proveedor[] = [];
  isLoading: boolean = true;

  constructor(
    private proveedorService: ProveedorService,
    private dialog: MatDialog // Asegúrate de que MatDialog esté inyectado
  ) { }

  // ... (ngOnInit, cargarProveedores, abrirDialogCrear, abrirDialogEditar) ...

  /**
   * Llama al servicio para eliminar un proveedor usando el diálogo de confirmación
   */
  eliminarProveedor(proveedor: Proveedor): void {

    // <<< CAMBIO: Usar MatDialog en lugar de 'confirm()'
    const dialogRef = this.dialog.open(EliminarDialogComponent, {
      width: '350px',
      // Pasamos el nombre del proveedor
      data: { nombreItem: proveedor.nombreComercial }
    });

    // Escuchamos el resultado
    dialogRef.afterClosed().subscribe(result => {
      // Si el usuario confirma la eliminación (result es true)
      if (result) {
        this.proveedorService.eliminarProveedor(proveedor.id).subscribe({
          next: () => {
            console.log('Proveedor eliminado:', proveedor.nombreComercial);
            // Filtramos la lista para quitar el eliminado
            this.proveedores = this.proveedores.filter(p => p.id !== proveedor.id);
          },
          error: (err) => {
            console.error('Error eliminando proveedor:', err);
            // Cambiamos el alert simple por un mensaje en consola
            alert('No se pudo eliminar el proveedor.');
          }
        });
      }
    });
  }
}
