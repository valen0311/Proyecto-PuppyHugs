// Archivo: src/app/promociones-admin/promociones-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { PromocionService } from '../services/promocion.service'; // Importamos el servicio
import { Promocion } from '../model/promocion.interface'; // Importamos el modelo
// (Importaremos el Dialog más adelante)
// import { MatDialog } from '@angular/material/dialog';
// import { CrearPromocionDialogComponent } from '../crear-promocion-dialog/crear-promocion-dialog.component';

@Component({
  selector: 'app-promociones-admin',
  templateUrl: './promociones-admin.component.html',
  // Reusamos el CSS de productos para mantener la consistencia
  styleUrls: ['../productos-admin/productos-admin.component.css']
})
export class PromocionesAdminComponent implements OnInit {

  // Arreglo para guardar las promociones de la API
  promociones: Promocion[] = [];
  isLoading: boolean = true;

  constructor(
    private promocionService: PromocionService
    // private dialog: MatDialog // Para el Pop-up (luego)
  ) { }

  ngOnInit(): void {
    // 1. Cuando el componente carga, llama a la función de cargar
    this.cargarPromociones();
  }

  /**
   * 2. Llama al servicio para obtener todas las promociones
   */
  cargarPromociones(): void {
    this.isLoading = true;
    this.promocionService.getPromociones().subscribe({
      next: (data) => {
        this.promociones = data;
        this.isLoading = false;
        console.log('Promociones cargadas:', data);
      },
      error: (err) => {
        console.error('Error cargando promociones:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * 3. Abre el diálogo para crear una nueva promoción
   */
  abrirDialogCrear(): void {
    console.log("Abriendo diálogo para crear promoción...");
    /*
    const dialogRef = this.dialog.open(CrearPromocionDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarPromociones(); // Si es exitoso, recarga la lista
      }
    });
    */
  }

  /**
   * 4. Abre el diálogo para editar una promoción existente
   */
  abrirDialogEditar(promocion: Promocion): void {
    console.log("Abriendo diálogo para editar promoción:", promocion);
    /*
    const dialogRef = this.dialog.open(CrearPromocionDialogComponent, {
      width: '500px',
      data: promocion // Pasamos la promoción al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarPromociones(); // Si es exitoso, recarga la lista
      }
    });
    */
  }


  /**
   * 5. Llama al servicio para eliminar una promoción
   */
  eliminarPromocion(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta promoción?')) {
      this.promocionService.eliminarPromocion(id).subscribe({
        next: () => {
          console.log('Promoción eliminada');
          // Quita la promoción de la lista local
          this.promociones = this.promociones.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Error eliminando promoción:', err);
          alert('No se pudo eliminar la promoción.');
        }
      });
    }
  }
}
