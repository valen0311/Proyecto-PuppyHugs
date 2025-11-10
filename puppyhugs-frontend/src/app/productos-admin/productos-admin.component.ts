// Archivo: src/app/productos-admin/productos-admin.component.ts
// (Versión actualizada que USA el Diálogo)

import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../model/producto.interface';

// <<< CAMBIO 1: Importar el MatDialog y el componente del Diálogo
import { MatDialog } from '@angular/material/dialog';
import { CrearProductoDialogComponent } from '../crear-producto-dialog/crear-producto-dialog.component';

@Component({
  selector: 'app-productos-admin',
  templateUrl: './productos-admin.component.html',
  styleUrls: ['./productos-admin.component.css']
})
export class ProductosAdminComponent implements OnInit {

  productos: Producto[] = [];
  isLoading: boolean = true;

  constructor(
    private productoService: ProductoService,
    private dialog: MatDialog // <<< CAMBIO 2: Inyectar el servicio de Diálogos
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.isLoading = false;
        console.log('Productos cargados:', data);
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * 3. Abre el diálogo para crear un nuevo producto
   */
  abrirDialogCrear(): void {
    console.log("Abriendo diálogo para crear...");

    // <<< CAMBIO 3: Descomentar y usar 'this.dialog.open'
    const dialogRef = this.dialog.open(CrearProductoDialogComponent, {
      width: '500px',
      // No pasamos 'data' porque es modo creación
    });

    // Escuchamos el resultado del diálogo
    dialogRef.afterClosed().subscribe(result => {
      // Si el diálogo nos devolvió 'true' (porque se guardó exitosamente)
      if (result) {
        this.cargarProductos(); // Recargamos la lista
      }
    });
  }

  /**
   * 4. Abre el diálogo para editar un producto existente
   */
  abrirDialogEditar(producto: Producto): void {
    console.log("Abriendo diálogo para editar:", producto);

    // <<< CAMBIO 4: Descomentar y usar 'this.dialog.open'
    const dialogRef = this.dialog.open(CrearProductoDialogComponent, {
      width: '500px',
      data: producto // <<< Pasamos el producto al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarProductos(); // Recargamos la lista
      }
    });
  }


  /**
   * 5. Llama al servicio para eliminar un producto
   */
  eliminarProducto(id: number): void {
    // (Esta función no cambia, pero la dejamos para completitud)
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          console.log('Producto eliminado');
          this.productos = this.productos.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Error eliminando producto:', err);
          alert('No se pudo eliminar el producto.');
        }
      });
    }
  }
}
