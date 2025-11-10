// Archivo: src/app/proveedores-admin/proveedores-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../services/proveedor.service'; // Importamos el servicio
import { Proveedor } from '../model/proveedor.interface'; // Importamos el modelo
// (Importaremos el Dialog más adelante)
// import { MatDialog } from '@angular/material/dialog';
// import { CrearProveedorDialogComponent } from '../crear-proveedor-dialog/crear-proveedor-dialog.component';

@Component({
  selector: 'app-proveedores-admin',
  templateUrl: './proveedores-admin.component.html',
  styleUrls: ['./proveedores-admin.component.css']
})
export class ProveedoresAdminComponent implements OnInit {

  // Arreglo para guardar los proveedores de la API
  proveedores: Proveedor[] = [];
  isLoading: boolean = true;

  constructor(
    private proveedorService: ProveedorService
    // private dialog: MatDialog // Para el Pop-up (luego)
  ) { }

  ngOnInit(): void {
    // 1. Cuando el componente carga, llama a la función de cargar
    this.cargarProveedores();
  }

  /**
   * 2. Llama al servicio para obtener todos los proveedores
   */
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
    /*
    const dialogRef = this.dialog.open(CrearProveedorDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarProveedores(); // Si es exitoso, recarga la lista
      }
    });
    */
  }

  /**
   * 4. Abre el diálogo para editar un proveedor existente
   */
  abrirDialogEditar(proveedor: Proveedor): void {
    console.log("Abriendo diálogo para editar proveedor:", proveedor);
    /*
    const dialogRef = this.dialog.open(CrearProveedorDialogComponent, {
      width: '500px',
      data: proveedor // Pasamos el proveedor al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarProveedores(); // Si es exitoso, recarga la lista
      }
    });
    */
  }


  /**
   * 5. Llama al servicio para eliminar un proveedor
   */
  eliminarProveedor(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe({
        next: () => {
          console.log('Proveedor eliminado');
          // Quita el proveedor de la lista local
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
