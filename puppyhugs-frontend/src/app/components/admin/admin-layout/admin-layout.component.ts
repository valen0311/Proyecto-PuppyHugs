// src/app/components/admin/admin-layout/admin-layout.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // 1. Importar RouterOutlet
import { CommonModule } from '@angular/common';

// 2. Importar el Sidebar que acabamos de crear
import { SidebarAdminComponent } from '../../shared/sidebar-admin/sidebar-admin.component';
// 3. Importar el modelo Cliente para saber qué forma tiene el usuario
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  // 4. Declarar que este componente usa el Sidebar y el RouterOutlet
  imports: [
    CommonModule,
    RouterOutlet, // Para las páginas "hijas"
    SidebarAdminComponent // El sidebar que creamos
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {

  private router = inject(Router);

  // 5. Esta variable guardará el admin logueado
  public adminUser: Cliente | null = null;

  /**
   * ngOnInit se ejecuta al cargar este componente.
   * Es perfecto para proteger la ruta.
   */
  ngOnInit(): void {
    const userStorage = localStorage.getItem('usuarioLogueado');

    // 6. Si no hay usuario en localStorage, expulsar a /login
    if (!userStorage) {
      this.router.navigate(['/login']);
      return; // Detener la ejecución
    }

    // 7. Si hay usuario, lo convertimos a objeto
    const user: Cliente = JSON.parse(userStorage);

    // 8. Si el rol NO es ROL_ADMIN, expulsar a /login
    if (user.rol !== 'ROL_ADMIN') {
      console.warn('Acceso denegado: Se requiere ROL_ADMIN.');
      this.router.navigate(['/login']);
      return;
    }

    // 9. Si pasa todas las validaciones, guardamos el usuario
    this.adminUser = user;
  }

  /**
   * Este método se activa cuando el Sidebar (hijo) emite el
   * evento 'logoutEvent'.
   */
  public onLogout(): void {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/login']);
  }
}
