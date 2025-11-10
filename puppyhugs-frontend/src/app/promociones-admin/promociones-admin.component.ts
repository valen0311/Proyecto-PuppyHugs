// Archivo: src/app/promociones-admin/promociones-admin.component.ts
// (Versión actualizada que USA el Diálogo)

import { Component, OnInit } from '@angular/core';
import { PromocionService } from '../services/promocion.service';
import { Promocion } from '../model/promocion.interface';

// <<< CAMBIO 1: Importar el MatDialog y el componente del Diálogo
import { MatDialog } from '@angular/material/dialog';
import { CrearPromocionDialogComponent } from '../crear-promocion-dialog/crear-promocion-dialog.component';

@Component({
  selector: 'app-promociones-admin',
  templateUrl: './promociones-admin.component.html',
  // Reusamos el CSS de productos para mantener la consistencia
  styleUrls: ['../productos-admin/productos-admin.component.css']
})
export class PromocionesAdminComponent implements OnInit {

  promociones: Promocion[] = [];
  isLoading: boolean = true;

  constructor(
    private promocionService: PromocionService,
    private dialog: MatDialog // <<< CAMBIO 2: Inyectar el servicio de Diálogos
  ) { }

  ngOnInit(): void {
    this.cargarPromociones();
  }

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

    // <<< CAMBIO 3: Descomentar y usar 'this.dialog.open'
    const dialogRef = this.dialog.open(CrearPromocionDialogComponent, {
      width: '550px' // Ancho para los campos de fecha
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarPromociones(); // Recargamos la lista
      }
    });
  }

  /**
   * 4. Abre el diálogo para editar una promoción existente
   */
  abrirDialogEditar(promocion: Promocion): void {
    console.log("Abriendo diálogo para editar promoción:", promocion);

    // <<< CAMBIO 4: Descomentar y usar 'this.dialog.open'
    const dialogRef = this.dialog.open(CrearPromocionDialogComponent, {
      width: '550px',
      data: promocion // <<< Pasamos la promoción al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarPromociones(); // Recargamos la lista
      }
    });
  }


  /**
   * 5. Llama al servicio para eliminar una promoción
   */
  eliminarPromocion(id: number): void {
    // (Esta función no cambia)
    if (confirm('¿Estás seguro de que deseas eliminar esta promoción?')) {
      this.promocionService.eliminarPromocion(id).subscribe({
        next: () => {
          console.log('Promoción eliminada');
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
