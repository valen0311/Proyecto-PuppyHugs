// Archivo: src/app/productos-admin/productos-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service'; // Importamos el servicio
import { Producto } from '../model/producto.interface'; // Importamos el modelo
// (Importaremos el Dialog más adelante)
// import { MatDialog } from '@angular/material/dialog';
// import { CrearProductoDialogComponent } from '../crear-producto-dialog/crear-producto-dialog.component';

@Component({
  selector: 'app-productos-admin',
  templateUrl: './productos-admin.component.html',
  styleUrls: ['./productos-admin.component.css']
})
export class ProductosAdminComponent implements OnInit {

  // Arreglo para guardar los productos que vienen de la API
  productos: Producto[] = [];
  isLoading: boolean = true;

  constructor(
    private productoService: ProductoService
    // private dialog: MatDialog // Para el Pop-up (luego)
  ) { }

  ngOnInit(): void {
    // 1. Cuando el componente carga, llama a la función de cargar productos
    this.cargarProductos();
  }

  /**
   * 2. Llama al servicio para obtener todos los productos
   */
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
    /*
    const dialogRef = this.dialog.open(CrearProductoDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarProductos(); // Si el diálogo fue exitoso, recarga la lista
      }
    });
    */
  }

  /**
   * 4. Abre el diálogo para editar un producto existente
   */
  abrirDialogEditar(producto: Producto): void {
    console.log("Abriendo diálogo para editar:", producto);
    /*
    const dialogRef = this.dialog.open(CrearProductoDialogComponent, {
      width: '500px',
      data: producto // Pasamos el producto al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarProductos(); // Si el diálogo fue exitoso, recarga la lista
      }
    });
    */
  }


  /**
   * 5. Llama al servicio para eliminar un producto
   */
  eliminarProducto(id: number): void {
    // Pedimos confirmación
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          console.log('Producto eliminado');
          // Quita el producto de la lista local para feedback instantáneo
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
