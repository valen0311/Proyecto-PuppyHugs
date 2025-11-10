// src/app/components/shared/sidebar-admin/sidebar-admin.component.ts

import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // 1. Importar RouterLink
import { CommonModule } from '@angular/common';
import { Cliente } from '../model/cliente.model'; // 2. Importar el modelo

@Component({
  selector: 'app-sidebar-admin', // <app-sidebar-admin>
  standalone: true,
  // 3. Importar RouterLink para que [routerLink] funcione en el HTML
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent {

  private router = inject(Router);

  // 4. Recibe el objeto del admin logueado desde el componente "padre"
  @Input() adminUser: Cliente | null = null;

  // 5. Evento para notificar al "padre" que el usuario quiere salir
  @Output() logoutEvent = new EventEmitter<void>();

  /**
   * Método que se llama al hacer clic en "Cerrar Sesión"
   * No ejecuta el logout aquí, solo notifica al padre.
   */
  public handleLogout(): void {
    this.logoutEvent.emit();
  }
}
