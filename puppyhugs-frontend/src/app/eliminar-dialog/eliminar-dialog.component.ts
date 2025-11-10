// Archivo: src/app/eliminar-dialog/eliminar-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Definimos una interfaz simple para la data que se le pasa al diálogo
export interface EliminarDialogData {
  nombreItem: string; // El nombre del item que se va a borrar (ej: "Producto X" o "Proveedor Y")
}

@Component({
  selector: 'app-eliminar-dialog',
  templateUrl: './eliminar-dialog.component.html',
  styleUrls: ['./eliminar-dialog.component.css']
})
export class EliminarDialogComponent implements OnInit {

  // La data inyectada contiene el nombre del item
  constructor(
    public dialogRef: MatDialogRef<EliminarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EliminarDialogData
  ) { }

  ngOnInit(): void { }

  /**
   * Cierra el diálogo y devuelve 'false' (cancelar la acción)
   */
  onCancelar(): void {
    this.dialogRef.close(false);
  }

  /**
   * Cierra el diálogo y devuelve 'true' (confirmar la eliminación)
   */
  onConfirmar(): void {
    this.dialogRef.close(true);
  }
}
