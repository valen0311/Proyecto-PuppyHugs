import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../services/autenticacion.service';
import { Cliente } from '../model/cliente.interface';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent implements OnInit {

  // Variable para guardar el usuario y mostrar su nombre
  usuarioLogueado: Cliente | null = null;

  constructor(private autenticacionService: AutenticacionService) { }

  ngOnInit(): void {
    // 1. Obtenemos el usuario actual del servicio
    // (Usamos .value para obtener la foto instantánea de quién está logueado)
    this.usuarioLogueado = this.autenticacionService.usuarioActualValor;
  }

  /**
   * 2. Llama al método logout() del servicio
   */
  cerrarSesion(): void {
    this.autenticacionService.logout();
  }
}
