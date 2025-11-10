// Archivo: src/app/proveedores-admin/proveedores-admin.component.ts
// (Versión actualizada que USA el Diálogo)

import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../services/proveedor.service';
import { Proveedor } from '../model/proveedor.interface';

// <<< CAMBIO 1: Importar el MatDialog y el componente del Diálogo
import { MatDialog } from '@angular/material/dialog';
import { CrearProveedorDialogComponent } from '../crear-proveedor-dialog/crear-proveedor-dialog.component';

@Component({
  selector: 'app-proveedores-admin',
  templateUrl: './proveedores-admin.component.html',
  // Usamos el CSS de productos (o el que copiaste)
  styleUrls: ['../productos-admin/productos-admin.component.css']
})
export class ProveedoresAdminComponent implements OnInit {

  proveedores: Proveedor[] = [];
  isLoading: boolean = true;

  constructor(
    private proveedorService: ProveedorService,
    private dialog: MatDialog // <<< CAMBIO 2: Inyectar el servicio de Diálogos
  ) { }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.isLoading = true;
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.isLoading = false;
        console.log('Proveedores cargados:', data);
      },
      error: (err) => {
        console.error('Error cargando proveedores:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * 3. Abre el diálogo para crear un nuevo proveedor
   */
  abrirDialogCrear(): void {
    console.log("Abriendo diálogo para crear proveedor...");

    // <<< CAMBIO 3: Descomentar y usar 'this.dialog.open'
    const dialogRef = this.dialog.open(CrearProveedorDialogComponent, {
      width: '550px' // Un poco más ancho para 6 campos
    });

    // Escuchamos el resultado del diálogo
    dialogRef.afterClosed().subscribe(result => {
      // Si el diálogo nos devolvió 'true' (porque se guardó)
      if (result) {
        this.cargarProveedores(); // Recargamos la lista
      }
    });
  }

  /**
   * 4. Abre el diálogo para editar un proveedor existente
   */
  abrirDialogEditar(proveedor: Proveedor): void {
    console.log("Abriendo diálogo para editar proveedor:", proveedor);

    // <<< CAMBIO 4: Descomentar y usar 'this.dialog.open'
    const dialogRef = this.dialog.open(CrearProveedorDialogComponent, {
      width: '550px',
      data: proveedor // <<< Pasamos el proveedor al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarProveedores(); // Recargamos la lista
      }
    });
  }


  /**
   * 5. Llama al servicio para eliminar un proveedor
   */
  eliminarProveedor(id: number): void {
    // (Esta función no cambia)
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe({
        next: () => {
          console.log('Proveedor eliminado');
          this.proveedores = this.proveedores.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Error eliminando proveedor:', err);
          alert('No se pudo eliminar el proveedor.');
        }
      });
    }
  }
}
