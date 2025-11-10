// Archivo: src/app/dashbord-admin/dashbord-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../services/autenticacion.service';

@Component({
  selector: 'app-dashbord-admin',
  templateUrl: './dashbord-admin.component.html',
  styleUrls: ['./dashbord-admin.component.css']
})
export class DashbordAdminComponent implements OnInit {

  nombreAdmin: string | null = null;
  fechaActual: Date = new Date();

  constructor(
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit(): void {
    // Obtener el nombre del usuario logeado para el saludo
    const usuario = this.autenticacionService.usuarioActualValor;
    if (usuario) {
      this.nombreAdmin = usuario.nombreCompleto;
    }
  }

  /**
   * Llama al servicio de autenticación para cerrar la sesión
   */
  cerrarSesion(): void {
    this.autenticacionService.logout();
    // La redirección al login se maneja en el servicio
  }
}
